import express from "express";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";
import rateLimit from "express-rate-limit";

export const extractRouter = express.Router();

const limiter = rateLimit({ windowMs: 60000, max: 20, message: { error: "Too many requests." } });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, cb) => file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only")) });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a bank document parser for Pakistani banks. Extract bank account details from the image and return ONLY valid JSON:
{
  "iban": "string | null",
  "accountNumber": "string | null",
  "accountTitle": "string | null",
  "bankName": "string | null",
  "bankCode": "string | null",
  "confidence": "high | medium | low",
  "warnings": []
}
Rules: IBAN uppercase no spaces, accountNumber digits only, bankCode = 4-letter code from IBAN positions 5-8.`;

extractRouter.post("/", limiter, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file provided." });
    const base64Image = req.file.buffer.toString("base64");
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: req.file.mimetype, data: base64Image } }, { type: "text", text: "Extract bank account details." }] }],
    });
    const rawText = message.content[0].text.trim();
    let parsed;
    try {
      parsed = JSON.parse(rawText.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim());
    } catch {
      return res.status(422).json({ error: "Could not parse bank details. Try a clearer photo." });
    }
    return res.json(parsed);
  } catch (err) { next(err); }
});
