import ImageUploader from "./components/ImageUploader.jsx";
import ManualForm from "./components/ManualForm.jsx";
import ExtractedPreview from "./components/ExtractedPreview.jsx";
import QRResult from "./components/QRResult.jsx";
import { useQRGenerator } from "./hooks/useQRGenerator.js";

export default function App() {
  const { step, setStep, inputMode, setInputMode, form, updateField, qr, loading, error, setError, ocrWarnings, handleImageUpload, handleGenerate, reset } = useQRGenerator();
  const steps = [{ id: "input", label: "Enter details" }, { id: "preview", label: "Review" }, { id: "done", label: "Your QR" }];
  const idx = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-start py-12 px-4">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          </div>
          <span className="text-xl font-semibold tracking-tight">PayZap</span>
        </div>
        <p className="text-sm text-stone-400 max-w-xs mx-auto">Generate Raast-compliant payment QR codes for Pakistani bank accounts</p>
      </header>

      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-1 mb-6">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${i < idx ? "bg-brand-500 text-white" : i === idx ? "bg-brand-500 text-white ring-4 ring-brand-500/20" : "bg-stone-100 text-stone-400"}`}>{i < idx ? "✓" : i + 1}</div>
                <span className={`text-xs transition-colors ${i === idx ? "text-stone-700 font-medium" : "text-stone-300"}`}>{s.label}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-stone-100 ml-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600">✕</button>
            </div>
          )}
          {step === "input" && (
            <div className="space-y-5">
              <div className="flex bg-stone-100 rounded-xl p-1">
                {["photo", "manual"].map(mode => (
                  <button key={mode} onClick={() => setInputMode(mode)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === mode ? "bg-white shadow-sm text-stone-800" : "text-stone-400 hover:text-stone-600"}`}>
                    {mode === "photo" ? "📷 Photo" : "✏️ Manual entry"}
                  </button>
                ))}
              </div>
              {inputMode === "photo" ? <ImageUploader onFile={handleImageUpload} loading={loading} /> : <ManualForm form={form} updateField={updateField} onSubmit={handleGenerate} loading={loading} />}
            </div>
          )}
          {step === "preview" && <ExtractedPreview form={form} updateField={updateField} warnings={ocrWarnings} onConfirm={handleGenerate} onBack={() => setStep("input")} loading={loading} />}
          {step === "done" && qr && <QRResult qr={qr} form={form} onReset={reset} />}
        </div>
      </div>

      <footer className="mt-8 text-xs text-stone-300 text-center space-y-1">
        <p>No account data is stored. QR codes are generated and discarded.</p>
        <p><a href="https://github.com/arqam001/Bank-Account-QR-Code-Generator" className="hover:text-stone-400 underline" target="_blank" rel="noopener noreferrer">Open source on GitHub</a></p>
      </footer>
    </div>
  );
}
