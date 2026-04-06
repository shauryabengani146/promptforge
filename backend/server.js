// server.js
// Main entry point for the PromptForge backend

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import route handlers
const analyzeRouter = require("./routes/analyze");
const generateRouter = require("./routes/generate");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE SETUP
// =====================

// Enable CORS so our React frontend can communicate with this server
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Request logger - helpful for debugging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// =====================
// ROUTES
// =====================

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "PromptForge API is running! 🚀",
        timestamp: new Date().toISOString(),
    });
});

// Main API routes
app.use("/analyze", analyzeRouter);
app.use("/generate", generateRouter);

// =====================
// ERROR HANDLING
// =====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.path} not found.`,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: "An internal server error occurred.",
    });
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
    console.log("\n🔥 PromptForge Backend Started!");
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 API Key loaded: ${process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No"}`);
    console.log("\nReady to forge some prompts! ⚡\n");
});