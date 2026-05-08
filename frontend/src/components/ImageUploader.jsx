import { useRef, useState } from "react";

export default function ImageUploader({ onFile, loading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  function handleFiles(files) {
    const file = files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFile(file);
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? "border-brand-500 bg-brand-50" : "border-stone-200 hover:border-stone-300 bg-white"} ${loading ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {preview ? (
          <img src={preview} alt="Uploaded bank slip" className="mx-auto max-h-52 rounded-xl object-contain" />
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">Drop your bank slip photo here</p>
              <p className="text-xs text-stone-400 mt-1">or click to browse — JPG, PNG up to 10 MB</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 rounded-2xl bg-white/80 flex flex-col items-center justify-center gap-2">
            <svg className="w-6 h-6 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <p className="text-sm text-stone-500">Reading your bank details…</p>
          </div>
        )}
      </div>
      {preview && !loading && (
        <button className="w-full text-xs text-stone-400 hover:text-stone-600 transition-colors" onClick={(e) => { e.stopPropagation(); setPreview(null); }}>✕ Remove image</button>
      )}
    </div>
  );
}
