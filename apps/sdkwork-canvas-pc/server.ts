import { GoogleGenAI } from '@google/genai';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  let ai: GoogleGenAI | null = null;
  const initAI = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  };

  // API Route: AI Writing / Generation (Articles, Novels, News)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, type } = req.body;
      const genAI = initAI();
      const systemInstruction = `You are a professional AI writer inside a highly professional workspace application called sdkwork-canvas-pc. You generate high-quality content. The user wants a ${type}. Output only the content without conversational filler.`;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { systemInstruction }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Generate Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: AI Editing & Summarization
  app.post('/api/ai/edit', async (req, res) => {
    try {
      const { text, action } = req.body;
      const genAI = initAI();
      
      let instruction = "Edit the following text.";
      switch (action) {
        case 'summarize': instruction = "Provide a concise professional summary of the following text:"; break;
        case 'improve': instruction = "Improve the grammar, tone, and professional quality of the following text, keeping the original meaning:"; break;
        case 'expand': instruction = "Expand on the following text professionally, adding relevant details:"; break;
        case 'translate': instruction = "Translate the following text to professional English or Chinese depending on its current language, making it native and elegant:"; break;
      }
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${instruction}\n\n${text}`
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Edit Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
