// utils/api.js
const API_BASE_URL = "https://promptforge-backend-dg57.onrender.com";

/**
 * Analyzes a prompt using the backend API
 * @param {string} prompt - The prompt text to analyze
 * @returns {Promise<Object>} - Analysis data from the AI
 */
export async function analyzePrompt(prompt) {
    const response = await fetch(`${API_BASE_URL}analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze prompt");
    }

    return data.data;
}

/**
 * Generates prompts for a given goal using the backend API
 * @param {string} goal - The user's goal description
 * @returns {Promise<Object>} - Generated prompts from the AI
 */
export async function generatePrompts(goal) {
    const response = await fetch(`${API_BASE_URL}generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: goal.trim() }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate prompts");
    }

    return data.data;
}