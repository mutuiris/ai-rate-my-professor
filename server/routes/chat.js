import express from 'express';
import { fetchGeminiData } from '../api/geminiApi.js';
import { queryPineconeForProfessor } from '../service/pineconeService.js';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    // Use Gemini AI to analyze the user query
    const refinedQuery = await fetchGeminiData(userMessage);

    // Query Pinecone using the refined query
    const professorRecommendations = await queryPineconeForProfessor(refinedQuery);

    // Return the recommendations to the user
    res.json({ reply: JSON.stringify(professorRecommendations) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process your request. Please try again.' });
  }
});

export default router;