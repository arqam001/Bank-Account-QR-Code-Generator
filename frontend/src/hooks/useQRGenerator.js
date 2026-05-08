import { useState, useCallback } from "react";
import { extractFromImage, generateQR } from "../utils/api.js";

const INITIAL_FORM = { iban: "", accountTitle: "", bankName: "", bankCode: "", accountNumber: "", amount: "", referenceId: "" };

export function useQRGenerator() {
  const [step, setStep] = useState("input");
  const [inputMode, setInputMode] = useState("photo");
  const [form, setForm] = useState(INITIAL_FORM);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ocrWarnings, setOcrWarnings] = useState([]);

  const handleImageUpload = useCallback(async (file) => {
    setLoading(true); setError(null); setOcrWarnings([]);
    try {
      const data = await extractFromImage(file);
      setForm({ iban: data.iban||"", accountTitle: data.accountTitle||"", bankName: data.bankName||"", bankCode: data.bankCode||"", accountNumber: data.accountNumber||"", amount: "", referenceId: "" });
      if (data.warnings?.length) setOcrWarnings(data.warnings);
      setStep("preview");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  const handleGenerate = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await generateQR({ iban: form.iban, accountTitle: form.accountTitle, bankCode: form.bankCode, amount: form.amount ? Number(form.amount) : 0, referenceId: form.referenceId });
      setQr(data); setStep("done");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [form]);

  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);
  const reset = useCallback(() => { setStep("input"); setForm(INITIAL_FORM); setQr(null); setError(null); setOcrWarnings([]); }, []);

  return { step, setStep, inputMode, setInputMode, form, updateField, qr, loading, error, setError, ocrWarnings, handleImageUpload, handleGenerate, reset };
}
