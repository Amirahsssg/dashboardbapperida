/* =========================================================
   ASISTEN AI — client side
   The Claude API key lives on the server (Netlify environment
   variable ANTHROPIC_API_KEY), not in this file.
   ========================================================= */

// Sends the question, the dashboard data, and the sections the worker ticked
// to our serverless function. Resolves to an object keyed by section name
// (each value is an array of points), or a plain string as a fallback.
window.askAssistant = async function (question, sections) {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: question,
      sections: sections,
      data: window.DASHBOARD_DATA || {},
    }),
  });
  let json = {};
  try { json = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error(json.error || ("HTTP " + res.status));
  if (!json.answer) throw new Error("Respons kosong dari server");
  return json.answer;
};
