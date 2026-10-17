// Netlify serverless function: forwards the assistant's question to OpenRouter.
// The API key is read from the OPENROUTER_API_KEY environment variable on Netlify,
// so it never reaches the browser.

const MODEL = "meta-llama/llama-3.3-70b-instruct";
const MAX_QUESTION = 500;
const MAX_DATA = 200000;

exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "OPENROUTER_API_KEY belum diatur di Netlify" }) };
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
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "X-Title": "Dashboard Bapperida",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "HTTP " + res.status + " dari OpenRouter" }) };
    }
    const json = await res.json();
    const answer = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
    if (!answer) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Respons kosong dari model" }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ answer: answer.trim() }) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Gagal menghubungi OpenRouter" }) };
  }
};
