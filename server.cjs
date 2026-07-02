var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.use(import_express.default.json({ limit: "10mb" }));
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
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.STRING
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
  } catch (error) {
    console.error("Translation error in server.ts:", error);
    res.status(500).json({ error: error.message || "Failed to translate texts." });
  }
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
