// routes/analyze.js
// Handles the POST /analyze endpoint
// Takes a user's prompt and returns analysis with ratings, issues, and improvements

const express = require("express");
const router = express.Router();
const openai = require("../utils/openai");

// POST /analyze
// Body: { prompt: "string" }
router.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;

        // --- Input Validation ---
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                error: "Please provide a valid prompt string in the request body.",
            });
        }

        if (prompt.trim().length < 3) {
            return res.status(400).json({
                error: "Prompt is too short. Please provide at least 3 characters.",
            });
        }

        if (prompt.length > 2000) {
            return res.status(400).json({
                error: "Prompt is too long. Please keep it under 2000 characters.",
            });
        }

        // --- Build the system prompt for OpenAI ---
        const systemPrompt = `You are an expert AI prompt engineer and analyst. 
Your job is to analyze user prompts and provide detailed, actionable feedback.
Always respond with valid JSON only - no markdown, no extra text, just pure JSON.

Analyze prompts based on these criteria:
- Clarity: Is the goal clear and unambiguous?
- Specificity: Does it include enough detail?
- Context: Does it provide necessary background?
- Structure: Is it well-organized?
- Actionability: Will an AI know exactly what to do?`;

        const userMessage = `Analyze this AI prompt and respond with JSON in EXACTLY this format:

{
  "rating": <number 1-10>,
  "ratingExplanation": "<one sentence explaining the rating>",
  "issues": [
    "<issue 1>",
    "<issue 2>",
    "<issue 3 if applicable>"
  ],
  "strengths": [
    "<strength 1>",
    "<strength 2 if applicable>"
  ],
  "improvedPrompt": "<the same prompt but significantly improved>",
  "beginnerAlternative": "<a simpler version suitable for someone new to AI>",
  "advancedAlternative": "<a sophisticated version using advanced prompting techniques>"
}

The prompt to analyze:
"${prompt}"`;

        // --- Call OpenAI API ---
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0].message.content.trim();

        // --- Parse JSON Response ---
        let analysisData;
        try {
            analysisData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response as JSON:", responseText);
            return res.status(500).json({
                error: "Failed to parse AI response. Please try again.",
            });
        }

        // --- Validate required fields ---
        const requiredFields = [
            "rating",
            "improvedPrompt",
            "beginnerAlternative",
            "advancedAlternative",
        ];
        for (const field of requiredFields) {
            if (!(field in analysisData)) {
                return res.status(500).json({
                    error: `AI response missing required field: ${field}. Please try again.`,
                });
            }
        }

        // --- Send successful response ---
        res.json({
            success: true,
            data: analysisData,
        });
    } catch (error) {
        if (error.status === 401) {
            return res.status(401).json({
                error: "Invalid OpenAI API key. Please check your .env file.",
            });
        }
        if (error.status === 429) {
            return res.status(429).json({
                error: "OpenAI rate limit reached. Please wait a moment and try again.",
            });
        }
        console.error("Analyze route error:", error.message);
        res.status(500).json({
            error: "An unexpected error occurred. Please try again.",
        });
    }
});

module.exports = router;