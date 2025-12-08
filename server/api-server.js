// server/api-server.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

// Load environment variables from the root .env file
dotenv.config(); 

// Initialize Express App and Port
const app = express();
const API_PORT = 3001; 

// --- Configuration ---
// Allow client (e.g., http://localhost:5173) to call this server
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your Vite dev port if different
    credentials: true,
}));

// Parse application/json requests
app.use(bodyParser.json());

// --- Gemini API Initialization ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in .env.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


// --- API Endpoint: /api/generate-prescription ---
app.post('/api/generate-prescription', async (req, res) => {
    // req.body contains the JSON data sent from the client
    const { mood, comfort } = req.body;

    if (!mood || !comfort) {
        return res.status(400).json({ message: 'Missing mood or comfort parameter in request body.' });
    }

    try {
        const systemInstruction = `You are the Teddy Bear Sanctuary's Chief Comfort Officer. Your goal is to generate a single, actionable comfort prescription in JSON format. The prescription must be based on the user's mood (${mood}) and comfort need (${comfort}).`;

        // The prompt is the same as your serverless function
        const prompt = `Generate a cozy, unique prescription. Include three distinct suggestions related to the user's comfort type. Return ONLY the JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                // Define the expected output structure (same as before)
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
        // We use JSON.parse because the response text is a JSON string
        res.status(200).json(JSON.parse(response.text));

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: 'Failed to generate prescription via AI.', error: error.message });
    }
});

// --- Server Startup ---
app.listen(API_PORT, () => {
    console.log(`🐻 Express API Server running securely on http://localhost:${API_PORT}`);
});