// server/api-server.js

import express from 'express';
import { GoogleGenAI } from '@google/genai';

// Initialize Express App
const app = express();

// --- Configuration ---
// Use Express's built-in parser. Vercel automatically parses JSON bodies sent to serverless functions.
app.use(express.json()); 
// NOTE: Vercel handles CORS and environment variables securely, so we remove dotenv.config and cors() usage.

// --- Gemini API Initialization ---
// Vercel securely injects the variable into process.env.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    // This will error out immediately if the key isn't set in the Vercel dashboard.
    console.error("FATAL ERROR: GEMINI_API_KEY is not set.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


// --- API Endpoint: /api/generate-prescription (ROUTE Definition) ---
// This route will be accessible via the path defined in vercel.json (e.g., /api/data/generate-prescription)
app.post('/api/generate-prescription', async (req, res) => {
    // req.body is automatically available thanks to Express and Vercel's helpers.
    const { mood, comfort } = req.body;

    if (!mood || !comfort) {
        return res.status(400).json({ message: 'Missing mood or comfort parameter in request body.' });
    }

    try {
        const systemInstruction = `You are the Teddy Bear Sanctuary's Chief Comfort Officer. Your goal is to generate a single, actionable comfort prescription in JSON format. The prescription must be based on the user's mood (${mood}) and comfort need (${comfort}).`;

        const prompt = `Generate a cozy, unique prescription. Include three distinct suggestions related to the user's comfort type. Return ONLY the JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        suggestions: { type: "array", items: { type: "string" } },
                        link_text: { type: "string" },
                        link_url: { type: "string" }
                    },
                    required: ["title", "description", "suggestions", "link_text", "link_url"]
                }
            }
        });

        // Send the generated JSON content back to the client
        res.status(200).json(JSON.parse(response.text));

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: 'Failed to generate prescription via AI.', error: error.message });
    }
});

// --- FINAL EXPORT: CRITICAL STEP ---
// This exports the Express app instance, which Vercel wraps into a Serverless Function.
export default app;