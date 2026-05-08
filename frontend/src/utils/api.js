const BASE = import.meta.env.VITE_API_URL || "";

export async function extractFromImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(BASE + "/api/extract", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "OCR failed");
  return data;
}

export async function generateQR(params) {
  const res = await fetch(BASE + "/api/qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, format: "base64" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "QR generation failed");
  return data;
}

export function buildFallbackUrl(iban, name, bankCode) {
  const base = import.meta.env.VITE_BACKEND_URL || "";
  return base + "/pay?iban=" + encodeURIComponent(iban) + "&name=" + encodeURIComponent(name) + "&bank=" + encodeURIComponent(bankCode || "");
}
