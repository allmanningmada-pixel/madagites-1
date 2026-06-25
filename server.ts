import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI with Gemini API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: '10mb' }));

// Translate API endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { texts, targetLang } = req.body;
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: "Invalid 'texts' parameter. Expected an array of strings." });
    }
    if (!targetLang) {
      return res.status(400).json({ error: "Missing 'targetLang' parameter." });
    }

    const languageName = targetLang === "en" ? "English" : "French";

    // Call Gemini to translate
    const prompt = `Translate the following array of texts into ${languageName}. 
Maintain any names, numbers, or specific punctuation as appropriate. 
Provide the response as a JSON array of strings in exactly the same order.

Texts to translate:
${JSON.stringify(texts, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of translated strings in the exact same order as the inputs."
        },
        systemInstruction: `You are a professional translator specializing in travel and hospitality. Translate the texts accurately into ${languageName}, ensuring a warm, natural, and highly polished tone suitable for a high-end travel catalog.`
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text from Gemini");
    }

    const translatedTexts = JSON.parse(textOutput.trim());
    res.json({ translatedTexts });
  } catch (error: any) {
    console.error("Translation error in server.ts:", error);
    res.status(500).json({ error: error.message || "Failed to translate texts." });
  }
});

// Serve Vite dev / production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
