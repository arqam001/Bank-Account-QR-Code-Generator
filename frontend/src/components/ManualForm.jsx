const BANKS = [
  { code: "UNIL", name: "United Bank Limited", raastEnabled: true },
  { code: "HABB", name: "Habib Bank Limited", raastEnabled: true },
  { code: "MUCB", name: "MCB Bank Limited", raastEnabled: true },
  { code: "MEZN", name: "Meezan Bank", raastEnabled: true },
  { code: "ALFH", name: "Bank Alfalah", raastEnabled: true },
  { code: "BAHL", name: "Bank Al Habib", raastEnabled: true },
  { code: "NBPA", name: "National Bank of Pakistan", raastEnabled: false },
  { code: "ASCM", name: "Askari Bank", raastEnabled: false },
  { code: "JSBL", name: "JS Bank", raastEnabled: false },
  { code: "FAYS", name: "Faysal Bank", raastEnabled: false },
];

export default function ManualForm({ form, updateField, onSubmit, loading }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">IBAN <span className="text-red-400">*</span></label>
        <input type="text" value={form.iban} onChange={(e) => updateField("iban", e.target.value.toUpperCase())} placeholder="PK54 UNIL 0109 0003 2506 8545" className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 placeholder:text-stone-300" required maxLength={29} />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">Account title <span className="text-red-400">*</span></label>
        <input type="text" value={form.accountTitle} onChange={(e) => updateField("accountTitle", e.target.value)} placeholder="Al Habib Telecom" className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 placeholder:text-stone-300" required maxLength={50} />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">Bank</label>
        <select value={form.bankCode} onChange={(e) => { updateField("bankCode", e.target.value); const b = BANKS.find(b => b.code === e.target.value); if (b) updateField("bankName", b.name); }} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
          <option value="">Select bank (optional)</option>
          {BANKS.map(b => <option key={b.code} value={b.code}>{b.name} {b.raastEnabled ? "✓ Raast" : ""}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">Fixed amount PKR — optional</label>
        <input type="number" value={form.amount} onChange={(e) => updateField("amount", e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 placeholder:text-stone-300" />
      </div>
      <button type="submit" disabled={loading || !form.iban || !form.accountTitle} className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? "Generating…" : "Generate QR code →"}
      </button>
    </form>
  );
}
