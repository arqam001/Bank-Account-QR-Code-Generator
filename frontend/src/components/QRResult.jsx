import { useState } from "react";
import { buildFallbackUrl } from "../utils/api.js";

export default function QRResult({ qr, form, onReset }) {
  const [copied, setCopied] = useState(false);
  const fallbackUrl = buildFallbackUrl(form.iban, form.accountTitle, form.bankCode);

  function downloadQR() {
    const a = document.createElement("a");
    a.href = qr.dataUrl;
    a.download = "payzap-" + form.accountTitle.replace(/\s+/g, "-").toLowerCase() + ".png";
    a.click();
  }

  function copyFallback() {
    navigator.clipboard.writeText(fallbackUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center space-y-4">
        <img src={qr.dataUrl} alt={"Payment QR for " + form.accountTitle} className="mx-auto w-52 h-52 rounded-xl" />
        <div>
          <p className="text-sm font-medium text-stone-700">{form.accountTitle}</p>
          <p className="text-xs font-mono text-stone-400 mt-0.5">{qr.formattedIBAN}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadQR} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">⬇ Download PNG</button>
          <button onClick={copyFallback} className={"flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors " + (copied ? "border-green-200 bg-green-50 text-green-700" : "border-stone-200 text-stone-600 hover:bg-stone-50")}>{copied ? "✓ Copied!" : "🔗 Copy link"}</button>
        </div>
      </div>
      <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4"><span className="text-stone-400 shrink-0">IBAN</span><span className="text-stone-700 text-right font-mono text-xs">{qr.formattedIBAN}</span></div>
        <div className="flex justify-between gap-4"><span className="text-stone-400 shrink-0">Account title</span><span className="text-stone-700 text-right">{form.accountTitle}</span></div>
        {form.bankName && <div className="flex justify-between gap-4"><span className="text-stone-400 shrink-0">Bank</span><span className="text-stone-700 text-right">{form.bankName}</span></div>}
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700 space-y-1">
        <p className="font-medium">How this QR works</p>
        <p>Raast-enabled apps (UBL, HBL, MCB, Meezan) will auto-populate the transfer form on scan.</p>
        <p>Other apps will open the pre-filled web page instead.</p>
      </div>
      <button onClick={onReset} className="w-full py-2.5 rounded-xl border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors">← Generate another</button>
    </div>
  );
}
