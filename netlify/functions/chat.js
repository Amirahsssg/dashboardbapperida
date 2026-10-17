// Netlify serverless function: forwards the assistant's question to the Claude API.
// The API key is read from the ANTHROPIC_API_KEY environment variable on Netlify,
// so it never reaches the browser. The model is fixed here, so the page can't change it.

const MODEL = "claude-haiku-5-5";
const MAX_QUESTION = 500;
const MAX_DATA = 200000;
const ALLOWED_SECTIONS = {
  Fakta: "fakta yang tercantum langsung di data",
  Analisis: "analisis atau tren berdasarkan data",
  Saran: "saran tindak lanjut yang praktis",
};

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

// Pulls the JSON object out of the model reply, even if it added code fences or extra text.
function parseSections(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(500, { error: "ANTHROPIC_API_KEY belum diatur di Netlify" });

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "Permintaan tidak valid" });
  }

  const question = String(payload.question || "").trim().slice(0, MAX_QUESTION);
  const data = JSON.stringify(payload.data || {}).slice(0, MAX_DATA);
  if (!question) return json(400, { error: "Pertanyaan kosong" });

  // Only the section names we know about are accepted from the page.
  const requested = (Array.isArray(payload.sections) ? payload.sections : []).filter((k) => ALLOWED_SECTIONS[k]);
  const sections = requested.length ? requested : Object.keys(ALLOWED_SECTIONS);

  const format = sections.map((k) => '"' + k + '": array berisi poin-poin singkat (' + ALLOWED_SECTIONS[k] + ')').join(", ");
  const system =
    "Kamu adalah Asisten AI Bapperida Kota Palembang. Jawab dalam Bahasa Indonesia, singkat dan jelas. " +
    "Jawab HANYA dari data berikut. Jika informasinya tidak ada di data, nyatakan itu sebagai poin di bagian Fakta. " +
    "Balas HANYA dengan satu objek JSON valid berisi kunci berikut dan tidak ada yang lain: {" + format + "}. " +
    "Jangan tambahkan kunci lain atau teks di luar JSON. " +
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
    if (!res.ok) return json(502, { error: "HTTP " + res.status + " dari Claude API" });

    const reply = await res.json();
    const text = (reply.content || []).map((b) => b.text || "").join("").trim();
    if (!text) return json(502, { error: "Respons kosong dari model" });

    const parsed = parseSections(text);
    if (!parsed) return json(200, { answer: text });

    // Keep only the sections the worker ticked, in the order they appear in ALLOWED_SECTIONS.
    const out = {};
    sections.forEach((k) => {
      const v = parsed[k];
      out[k] = Array.isArray(v) ? v.map(String) : (v ? [String(v)] : []);
    });
    return json(200, { answer: out });
  } catch (e) {
    return json(502, { error: "Gagal menghubungi Claude API" });
  }
};
