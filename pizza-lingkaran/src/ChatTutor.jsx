import { useState, useRef, useEffect } from "react";

// Pakai: <ChatTutor soal="Pizza berdiameter 28 cm, berapa kelilingnya?" />
export default function ChatTutor({ soal = "", tahapSekarang = "", kesulitan = "" }) {
  const [pesan, setPesan] = useState([
    { role: "assistant", content: "Halo! Aku Asisten Belajar (Kak Dit). Yuk kita kerjakan soalnya pelan-pelan. Menurutmu, apa saja yang diketahui dari soal ini?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ujung = useRef(null);

  useEffect(() => { ujung.current?.scrollIntoView({ behavior: "smooth" }); }, [pesan]);

  async function kirim() {
    const teks = input.trim();
    if (!teks || loading) return;
    const baru = [...pesan, { role: "user", content: teks }];
    setPesan(baru);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: baru, context: { soal, tahapSekarang, kesulitan } }),
      });
      const data = await res.json();
      setPesan([...baru, { role: "assistant", content: data.reply || data.error || "Maaf, ada gangguan." }]);
    } catch {
      setPesan([...baru, { role: "assistant", content: "Koneksi bermasalah, coba lagi ya." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 420, border: "1px solid #ccd", borderRadius: 12 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {pesan.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <span style={{ display: "inline-block", padding: "8px 12px", borderRadius: 12, maxWidth: "85%",
              background: m.role === "user" ? "#1f5fc4" : "#eef2fb", color: m.role === "user" ? "#fff" : "#111" }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: "#667" }}>Asisten sedang berpikir...</div>}
        <div ref={ujung} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: 8, borderTop: "1px solid #ccd" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && kirim()}
          placeholder="Tulis jawabanmu..." style={{ flex: 1, padding: 8 }} />
        <button onClick={kirim} disabled={loading}>Kirim</button>
      </div>
    </div>
  );
}
