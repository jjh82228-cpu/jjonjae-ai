import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gemini API 초기화
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages,
      config: {
        systemInstruction: "너는 친절하고 재치 있는 AI 친구 '쫀재'야. 사용자에게 반말과 친근하고 장난기 넘치는 어조로 자연스럽게 대답해줘.",
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'AI 응답을 가져오는 중 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
