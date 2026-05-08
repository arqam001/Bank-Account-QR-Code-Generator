import express from "express";
import { formatIBAN, PAKISTANI_BANKS } from "../../../shared/banks.js";

export const payRouter = express.Router();

function escapeHtml(str = "") {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
function initials(name = "") {
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase()||"").join("");
}

payRouter.get("/", (req, res) => {
  const { iban = "", name = "Unknown", bank = "" } = req.query;
  const formattedIBAN = formatIBAN(iban);
  const bankInfo = PAKISTANI_BANKS.find(b => b.code === bank);
  const bankName = bankInfo ? bankInfo.name : bank || "Unknown Bank";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Pay ${escapeHtml(name)} — PayZap</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f7f7f5;--card:#fff;--border:#e5e5e3;--text:#111;--muted:#6b6b68;--accent:#1a56db;--accent-bg:#eff4ff}
@media(prefers-color-scheme:dark){:root{--bg:#111;--card:#1c1c1a;--border:#2e2e2c;--text:#eee;--muted:#8c8c88;--accent:#60a5fa;--accent-bg:#1e2a3a}}
body{font-family:-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:2rem;width:100%;max-width:420px}
.avatar{width:52px;height:52px;border-radius:50%;background:var(--accent-bg);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:18px;color:var(--accent);margin:0 auto 12px}
h1{text-align:center;font-size:20px;font-weight:600;margin-bottom:4px}
.bank{text-align:center;font-size:13px;color:var(--muted);margin-bottom:1.5rem}
.field{margin-bottom:1rem}
.label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px}
.val{font-size:14px;font-family:monospace;word-break:break-all}
.btn{background:none;border:1px solid var(--border);border-radius:8px;padding:4px 12px;font-size:12px;cursor:pointer;color:var(--muted)}
.btn:hover{background:var(--accent-bg);color:var(--accent);border-color:var(--accent)}
.btn.ok{background:#dcfce7;color:#166534;border-color:#166534}
</style>
</head>
<body>
<div class="card">
<div class="avatar">${escapeHtml(initials(name))}</div>
<h1>${escapeHtml(name)}</h1>
<p class="bank">${escapeHtml(bankName)}</p>
<div class="field"><div class="label">IBAN</div><div class="row"><span class="val">${escapeHtml(formattedIBAN)}</span><button class="btn" onclick="copy('${escapeHtml(iban)}',this)">Copy</button></div></div>
<div class="field"><div class="label">Account title</div><div class="row"><span class="val">${escapeHtml(name)}</span><button class="btn" onclick="copy('${escapeHtml(name)}',this)">Copy</button></div></div>
<div class="field"><div class="label">Bank</div><div class="row"><span class="val">${escapeHtml(bankName)}</span></div></div>
</div>
<script>
function copy(t,b){navigator.clipboard.writeText(t).then(()=>{b.textContent='Copied!';b.classList.add('ok');setTimeout(()=>{b.textContent='Copy';b.classList.remove('ok')},2000)})}
</script>
</body>
</html>`);
});
