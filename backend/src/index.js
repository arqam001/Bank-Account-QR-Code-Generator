import "dotenv/config";
import express from "express";
import cors from "cors";
import { extractRouter } from "./routes/extract.js";
import { qrRouter } from "./routes/qr.js";
import { payRouter } from "./routes/pay.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map(o => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS: origin not allowed"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req, res) => res.json({ status: "ok", ts: Date.now() }));
app.use("/api/extract", extractRouter);
app.use("/api/qr", qrRouter);
app.use("/pay", payRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log("PayZap backend running on port " + PORT));
