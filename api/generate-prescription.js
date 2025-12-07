// /teddy-bear-sanctuary/api/generate-prescription.js

import { GoogleGenAI } from '@google/genai';

// Initialize client with secret key (read from environment variables)
// NOTE: Ensure the package is installed: npm install @google/genai
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This is the standard entry point for Vercel/Netlify Serverless Functions
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Use req.body for incoming JSON payload
  const { mood, comfort } = req.body;

  if (!mood || !comfort) {
    return res.status(400).json({ message: 'Missing mood or comfort parameter.' });
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
            title: { type: "string", description: "A catchy title for the prescription." },
            description: { type: "string", description: "A one-sentence summary of the recommendation." },
            suggestions: {
              type: "array",
              items: { type: "string" },
              description: "Three detailed, unique comfort actions."
            },
            link_text: { type: "string", description: "The primary call-to-action link text." },
            link_url: { type: "string", description: "A unique, themed URL path (e.g., /nook/sleep-guide)." }
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
}