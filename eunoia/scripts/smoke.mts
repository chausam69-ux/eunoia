// Smoke check: every public route + studio login returns 200 and contains expected text.
// Run with dev server up: npx tsx scripts/smoke.mts
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const checks: [string, string][] = [
  ["/", "DROWNING IN DATA"],
  ["/work", "WORK IS WHERE THE SKILLS CONNECT"],
  ["/work/northstar", "RESULTS ARE SIMULATED"],
  ["/", "Data analysis"],
  ["/lab", "LEARNING, PUBLISHED"],
  ["/lab/n8n-lead-router", "WHAT I LEARNED"],
  ["/capabilities", "UNDERSTAND"],
  ["/about", "INDEPENDENT"],
  ["/start", "TELL ME THE PROBLEM"],
  ["/studio/login", "EUNΟIA STUDIO"],
];
let fail = 0;
for (const [path, text] of checks) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  const body = await r.text();
  const ok = r.status === 200 && body.includes(text);
  if (!ok) fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${r.status} ${path}${ok ? "" : ` — missing "${text}"`}`);
}
const gate = await fetch(BASE + "/studio", { redirect: "manual" });
const gated = gate.status === 307 || gate.status === 302;
if (!gated) fail++;
console.log(`${gated ? "OK  " : "FAIL"} ${gate.status} /studio (must redirect when signed out)`);
if (fail) {
  console.error(`\n${fail} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
