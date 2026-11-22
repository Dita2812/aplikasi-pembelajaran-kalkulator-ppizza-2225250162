import { buatSystemPrompt } from "./rmt-prompt.mjs";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY; // dari environment variable, BUKAN dari kode
  if (!apiKey) {
    return Response.json({ error: "API key belum diatur di server (DEEPSEEK_API_KEY)." }, { status: 500 });
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

    if (!res.ok) {
      const detail = await res.text();
      console.error("DeepSeek error:", res.status, detail);
      return Response.json({ error: "Layanan AI sedang bermasalah." }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal menghubungi AI." }, { status: 500 });
  }
};

export const config = { path: "/api/chat" };
