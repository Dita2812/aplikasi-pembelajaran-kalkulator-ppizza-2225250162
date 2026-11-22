#!/usr/bin/env python3
import http.server
import json
import os
import socketserver
import urllib.request
import urllib.error

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_env_api_key():
    env_path = os.path.join(DIRECTORY, ".env")
    if not os.path.exists(env_path):
        return os.environ.get("DEEPSEEK_API_KEY", "")
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("DEEPSEEK_API_KEY="):
                val = line.split("=", 1)[1].strip()
                if val:
                    return val
    return os.environ.get("DEEPSEEK_API_KEY", "")

class AppRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path in ("/api/chat", "/api/chat/"):
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                body = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                print(f"JSON decode error: {e}, post_data={post_data}")
                self.send_error_json(400, f"Body tidak valid: {str(e)}")
                return

            messages = body.get("messages", [])
            context = body.get("context", {})
            api_key = get_env_api_key()

            if api_key and api_key.startswith("sk-"):
                # Call DeepSeek API
                try:
                    from_prompt = f"""Kamu adalah Kak Dit (Asisten Belajar AI) di aplikasi Pizza Lingkaran untuk siswa SMP kelas 8.
Materi: keliling dan luas lingkaran. Bahasa Indonesia ramah, singkat, memandu dengan metode Sokratik (RMT).
Pecah jadi langkah bertahap, jangan berikan jawaban akhir langsung.
Konteks Soal: {context.get('soal', '')}
Tahap RMT: {context.get('tahapSekarang', '')}
"""
                    payload = {
                        "model": "deepseek-chat",
                        "temperature": 0.4,
                        "max_tokens": 400,
                        "messages": [{"role": "system", "content": from_prompt}] + messages[-10:]
                    }
                    req = urllib.request.Request(
                        "https://api.deepseek.com/chat/completions",
                        data=json.dumps(payload).encode("utf-8"),
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {api_key}"
                        }
                    )
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        res_json = json.loads(resp.read().decode("utf-8"))
                        reply = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
                        self.send_json(200, {"reply": reply})
                        return
                except urllib.error.HTTPError as e:
                    err_msg = e.read().decode("utf-8")
                    print(f"DeepSeek API Error: {err_msg}")
                    self.send_error_json(502, f"DeepSeek API error: {e.code}")
                    return
                except Exception as ex:
                    print(f"Fetch error: {ex}")
                    self.send_error_json(500, f"Gagal menghubungi server AI: {str(ex)}")
                    return
            else:
                # Socratic RMT fallback response for local testing
                user_msgs = [m.get("content", "") for m in messages if m.get("role") == "user"]
                last_msg = (user_msgs[-1] if user_msgs else "").lower()

                if "keliling" in last_msg or "k =" in last_msg:
                    reply = "Bagus sekali! Rumus keliling lingkaran adalah K = π × d atau K = 2 × π × r. Nah, berapa nilai jari-jari (r) atau diameter (d) pada soal ini?"
                elif "luas" in last_msg or "l =" in last_msg:
                    reply = "Tepat! Rumus luas permukaan pizza adalah L = π × r². Perhatikan baik-baik: apakah yang diketahui di soal adalah diameter atau jari-jari?"
                elif any(c.isdigit() for c in last_msg):
                    reply = "Angka yang kamu sebutkan sudah menarik! Coba masukkan ke dalam rumus: jika diameter, bagi dua dulu untuk dapat jari-jari r. Lalu kalikan dengan π (22/7 atau 3,14)."
                else:
                    reply = "Hebat sudah mulai mencoba! Langkah 1 (RMT): Coba sebutkan dulu, dari soal pizza ini, informasi apa saja yang diketahui dan apa yang sedang ditanyakan?"

                self.send_json(200, {"reply": reply})
                return

        super().do_POST()

    def send_json(self, status_code, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status_code, message):
        self.send_json(status_code, {"error": message})

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), AppRequestHandler) as httpd:
        print(f"Pizza Lingkaran server + RMT Chat running at http://localhost:{PORT}")
        httpd.serve_forever()
