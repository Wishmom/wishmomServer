// api/server.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

import { connectDb } from "../database/db.js";       // your DB helper
import contactRoute from "../contactRoute.js";       // adjust paths if needed
import userRoutes from "../routes/user.js";

dotenv.config();

const app = express();
app.use(express.json());

// lightweight DB connection reuse for serverless (avoid reconnecting every request)
let dbConnected = false;
async function ensureDbConnected() {
  if (!dbConnected) {
    await connectDb();       // your existing connectDb function
    dbConnected = true;
  }
}

// Middleware to ensure DB connection is established (runs on first request after cold start)
app.use(async (req, res, next) => {
  try {
    await ensureDbConnected();
    next();
  } catch (err) {
    console.error("DB connect error:", err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

// CORS
app.use(
  cors({
    origin: process.env.FRONTENDURL || "*",
    credentials: true,
  })
);

// static uploads (Vercel has ephemeral filesystem; consider external storage for persistent files)
app.use("/uploads", express.static("uploads"));

// test root
app.get("/", (req, res) => res.send("Serverless API is working"));

// mount routes
app.use("/api", userRoutes);
app.use("/api", contactRoute);

// export serverless handler compatible with Vercel
export default serverless(app);
