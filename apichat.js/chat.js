import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages,
      config: {
        systemInstruction: "너는 친절하고 재치 있는 AI 친구 '박선우'야. 사용자에게 반말과 친근한 어조로 자연스럽게 대답해줘.",
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'AI 응답을 처리하는 중 오류가 발생했습니다.' });
  }
}