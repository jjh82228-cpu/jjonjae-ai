// server.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Gemini API 클라이언트 초기화 (환경변수 GEMINI_API_KEY 사용)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 박선우 AI 대화 API 엔드포인트
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body; // 클라이언트에서 보낸 이전 대화 기록

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: messages,
            config: {
                // 박선우 AI 페르소나 설정
                systemInstruction: "너는 친절하고 재치 있는 AI 친구 '박선우'야. 사용자에게 반말과 친근한 어조로 자연스럽게 대답해줘.",
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'AI 응답을 가져오는 중 오류가 발생했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 박선우 AI 서버 실행 중: http://localhost:${PORT}`);
});