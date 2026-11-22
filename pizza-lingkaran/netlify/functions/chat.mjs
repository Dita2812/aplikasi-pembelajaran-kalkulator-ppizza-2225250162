import { buatSystemPrompt } from "./rmt-prompt.mjs";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const { messages = [], context = {} } = body;
  // batasi riwayat agar hemat token dan tidak disalahgunakan
  const riwayat = messages
    .filter((m) => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

  const apiKey = process.env.DEEPSEEK_API_KEY;

  // Jika API Key DeepSeek sudah diset di server, gunakan DeepSeek API secara langsung
  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          temperature: 0.4,
          max_tokens: 400,
          messages: [{ role: "system", content: buatSystemPrompt(context) }, ...riwayat],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "";
        if (reply) {
          return Response.json({ reply });
        }
      } else {
        console.warn("DeepSeek API error:", res.status, await res.text());
      }
    } catch (err) {
      console.warn("DeepSeek fetch error:", err);
    }
  }

  // Fallback Tutor Sokratik RMT Cerdas (Bisa ditanyai bebas kapan saja tanpa batas kuota)
  const userMsgs = riwayat.filter((m) => m.role === "user");
  const lastMsg = (userMsgs[userMsgs.length - 1]?.content || "").toLowerCase();
  const soalTeks = context.soal || "";

  let reply = "";

  if (lastMsg.includes("keliling") || lastMsg.includes("k =")) {
    reply = "Tepat sekali! Konsep keliling adalah mengukur pinggiran atau crust pizza. Rumusnya adalah K = π × d (atau 2 × π × r). Sekarang pada soal ini, berapa nilai diameter (d) atau jari-jari (r)-nya?";
  } else if (lastMsg.includes("luas") || lastMsg.includes("l =")) {
    reply = "Bagus! Luas mengukur seluruh permukaan keju dan topping pizza. Rumusnya adalah L = π × r². Coba perhatikan: apakah di soal yang diketahui diameter atau jari-jari?";
  } else if (lastMsg.includes("jari") || lastMsg.includes("radius") || lastMsg.includes("r =")) {
    reply = "Hebat! Jari-jari (r) adalah jarak dari titik pusat pizza ke pinggirnya. Ingat: jika yang diketahui diameter (d), maka r = d / 2. Berapa nilai r yang kamu dapatkan?";
  } else if (lastMsg.includes("diameter") || lastMsg.includes(" d ")) {
    reply = "Betul! Diameter (d) adalah garis lurus yang membelah pizza melewati titik pusat (d = 2 × r). Jika mau menghitung luas, jangan lupa bagi dua dulu untuk mendapatkan jari-jari r ya!";
  } else if (lastMsg.includes("pi") || lastMsg.includes("π") || lastMsg.includes("22/7") || lastMsg.includes("3,14") || lastMsg.includes("3.14")) {
    reply = "Pemilihan nilai π sangat penting! Jika jari-jari atau diameter merupakan kelipatan 7 (seperti 7, 14, 21, 28), gunakan π = 22/7 agar mudah dicoret. Jika bukan kelipatan 7, gunakan π = 3,14.";
  } else if (/\d+/.test(lastMsg)) {
    reply = "Angka yang kamu sebutkan sudah pas! Sekarang coba masukkan angka tersebut ke dalam rumus: kalikan secara bertahap. Menurutmu, berapa hasil akhir perhitungannya?";
  } else if (lastMsg.includes("bingung") || lastMsg.includes("gimana") || lastMsg.includes("cara") || lastMsg.includes("tolong")) {
    reply = `Yuk kita bedah bersama pelan-pelan (Tahap 1 RMT)! Dari soal ini: "${soalTeks.slice(0, 80)}...", hal pertama apa yang diketahui? Apakah diameter atau jari-jarinya?`;
  } else {
    reply = "Halo! Kak Dit siap mendampingi proses berpikirmu. Menurutmu, untuk menyelesaikan soal ini, kita perlu mencari keliling (pinggiran) atau luas (seluruh bagian dalam)? Berikan alasanmu ya!";
  }

  return Response.json({ reply });
};

export const config = { path: "/api/chat" };
