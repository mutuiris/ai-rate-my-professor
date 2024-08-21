import express from 'express';
import { fetchGeminiData } from '../api/geminiApi';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const geminiResponse = await fetchGeminiData(userMessage);
    res.json({ reply: geminiResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Gemini API' });
  }
});

export default router;