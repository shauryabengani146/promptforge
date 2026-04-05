// routes/generate.js
// Handles the POST /generate endpoint
// Takes a user's goal and generates multiple prompt variations

const express = require("express");
const router = express.Router();
const openai = require("../utils/openai");

// POST /generate
// Body: { goal: "string" }
router.post("/", async (req, res) => {
    try {
        const { goal } = req.body;

        // --- Input Validation ---
        if (!goal || typeof goal !== "string") {
            return res.status(400).json({
                error: "Please provide a valid goal string in the request body.",
            });
        }

        if (goal.trim().length < 5) {
            return res.status(400).json({
                error: "Goal is too short. Please describe what you want to achieve.",
            });
        }

        if (goal.length > 1000) {
            return res.status(400).json({
                error: "Goal description is too long. Please keep it under 1000 characters.",
            });
        }

        // --- Build the system prompt ---
        const systemPrompt = `You are a master AI prompt engineer with deep expertise in crafting effective prompts.
You understand different prompting techniques including zero-shot, few-shot, chain-of-thought, and role-based prompting.
Always respond with valid JSON only - no markdown, no extra text, just pure JSON.`;

        const userMessage = `A user wants to achieve this goal with an AI assistant:
"${goal}"

Create THREE different prompts and respond with JSON in EXACTLY this format:

{
  "goalSummary": "<brief one-line summary of what the user wants>",
  "standardPrompt": {
    "title": "Standard Prompt",
    "prompt": "<a clear, well-structured prompt>",
    "explanation": "<1-2 sentences explaining why this works>"
  },
  "beginnerPrompt": {
    "title": "Beginner-Friendly Prompt",
    "prompt": "<a simple, straightforward prompt>",
    "explanation": "<1-2 sentences explaining the approach>"
  },
  "advancedPrompt": {
    "title": "Advanced Prompt",
    "prompt": "<a sophisticated prompt using role assignment, chain-of-thought, constraints>",
    "explanation": "<1-2 sentences explaining the advanced techniques>"
  }
}`;

        // --- Call OpenAI API ---
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.8,
            max_tokens: 2000,
        });

        const responseText = completion.choices[0].message.content.trim();

        // --- Parse JSON Response ---
        let generateData;
        try {
            generateData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response as JSON:", responseText);
            return res.status(500).json({
                error: "Failed to parse AI response. Please try again.",
            });
        }

        // --- Validate response structure ---
        const requiredFields = ["standardPrompt", "beginnerPrompt", "advancedPrompt"];
        for (const field of requiredFields) {
            if (!(field in generateData)) {
                return res.status(500).json({
                    error: `AI response missing required field: ${field}. Please try again.`,
                });
            }
        }

        // --- Send successful response ---
        res.json({
            success: true,
            data: generateData,
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
        console.error("Generate route error:", error.message);
        res.status(500).json({
            error: "An unexpected error occurred. Please try again.",
        });
    }
});

module.exports = router;