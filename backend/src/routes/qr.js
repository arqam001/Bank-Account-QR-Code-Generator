import express from "express";
import QRCode from "qrcode";
import rateLimit from "express-rate-limit";
import { buildRaastQRPayload } from "../../../shared/raast.js";
import { validatePakistaniIBAN, formatIBAN } from "../../../shared/banks.js";

export const qrRouter = express.Router();
const limiter = rateLimit({ windowMs: 60000, max: 60, message: { error: "Too many requests." } });

qrRouter.post("/", limiter, async (req, res, next) => {
  try {
    const { iban, accountTitle, bankCode, amount = 0, referenceId = "", format = "png" } = req.body;
    if (!iban || !accountTitle) return res.status(400).json({ error: "iban and accountTitle are required." });
    const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
    if (!validatePakistaniIBAN(cleanIBAN)) return res.status(400).json({ error: "Invalid Pakistani IBAN format." });

    const baseUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const fallbackUrl = baseUrl + "/pay?iban=" + cleanIBAN + "&name=" + encodeURIComponent(accountTitle) + "&bank=" + (bankCode || "");
    const payload = buildRaastQRPayload({ iban: cleanIBAN, accountTitle, amount: Number(amount), referenceId: (referenceId || "").substring(0, 25), fallbackUrl });

    const qrOptions = { errorCorrectionLevel: "M", type: "png", width: 400, margin: 2 };
    if (format === "svg") {
      const svg = await QRCode.toString(payload, { ...qrOptions, type: "svg" });
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(svg);
    }
    if (format === "base64") {
      const dataUrl = await QRCode.toDataURL(payload, qrOptions);
      return res.json({ dataUrl, payload, formattedIBAN: formatIBAN(cleanIBAN) });
    }
    const buffer = await QRCode.toBuffer(payload, qrOptions);
    res.setHeader("Content-Type", "image/png");
    return res.send(buffer);
  } catch (err) { next(err); }
});
