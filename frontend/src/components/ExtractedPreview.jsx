const BANKS = [
  { code: "UNIL", name: "United Bank Limited", raastEnabled: true },
  { code: "HABB", name: "Habib Bank Limited", raastEnabled: true },
  { code: "MUCB", name: "MCB Bank Limited", raastEnabled: true },
  { code: "MEZN", name: "Meezan Bank", raastEnabled: true },
  { code: "ALFH", name: "Bank Alfalah", raastEnabled: true },
  { code: "BAHL", name: "Bank Al Habib", raastEnabled: true },
  { code: "NBPA", name: "National Bank of Pakistan", raastEnabled: false },
];

export default function ExtractedPreview({ form, updateField, warnings, onConfirm, onBack, loading }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="space-y-4">
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1">
          <p className="text-xs font-medium text-amber-700">Review these fields:</p>
          {warnings.map((w, i) => <p key={i} className="text-xs text-amber-600">• {w}</p>)}
        </div>
      )}
      {[["IBAN", "iban", true, true], ["Account title", "accountTitle", false, true], ["Account number", "accountNumber", true, false]].map(([label, field, mono, req]) => (
        <div key={field}>
          <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">{label} {req && <span className="text-red-400">*</span>}</label>
          <input type="text" value={form[field]} onChange={(e) => updateField(field, mono ? e.target.value.toUpperCase() : e.target.value)} required={req} className={"w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 " + (mono ? "font-mono" : "")} />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">Bank</label>
        <select value={form.bankCode} onChange={(e) => { updateField("bankCode", e.target.value); const b = BANKS.find(b => b.code === e.target.value); if (b) updateField("bankName", b.name); }} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
          <option value="">Unknown</option>
          {BANKS.map(b => <option key={b.code} value={b.code}>{b.name} {b.raastEnabled ? "✓ Raast" : ""}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors">← Back</button>
        <button type="submit" disabled={loading || !form.iban || !form.accountTitle} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-40">{loading ? "Generating…" : "Looks good — generate QR →"}</button>
      </div>
    </form>
  );
}
