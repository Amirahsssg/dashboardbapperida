/* =========================================================
   ASISTEN AI — client side
   The OpenRouter key lives on the server (Netlify environment
   variable OPENROUTER_API_KEY), not in this file.
   ========================================================= */

// Sends one question plus the dashboard data to our serverless function.
// Resolves to the answer text.
window.askAssistant = async function (question) {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question, data: window.DASHBOARD_DATA || {} }),
  });
  let json = {};
  try { json = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error(json.error || ("HTTP " + res.status));
  if (!json.answer) throw new Error("Respons kosong dari server");
  return json.answer;
};
