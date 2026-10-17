// Netlify serverless function: forwards the assistant's question to the Claude API.
// The API key is read from the ANTHROPIC_API_KEY environment variable on Netlify,
// so it never reaches the browser. The model is fixed here, so the page can't change it.

const MODEL = "claude-haiku-5-5";
const MAX_QUESTION = 500;
const MAX_DATA = 200000;

exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY belum diatur di Netlify" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Permintaan tidak valid" }) };
  }

  const question = String(payload.question || "").trim().slice(0, MAX_QUESTION);
  const data = JSON.stringify(payload.data || {}).slice(0, MAX_DATA);
  if (!question) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Pertanyaan kosong" }) };
  }

  const system =
    "Kamu adalah Asisten AI Bapperida Kota Palembang. Jawab dalam Bahasa Indonesia, singkat dan jelas. " +
    "Jawab HANYA dari data berikut. Jika informasinya tidak ada di data, nyatakan bahwa tidak ditemukan. " +
    "Data dashboard (JSON): " + data;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        temperature: 0.3,
        system: system,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!res.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "HTTP " + res.status + " dari Claude API" }) };
    }
    const json = await res.json();
    const answer = (json.content || []).map((b) => b.text || "").join("").trim();
    if (!answer) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Respons kosong dari model" }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ answer: answer }) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Gagal menghubungi Claude API" }) };
  }
};
