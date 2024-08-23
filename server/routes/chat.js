import express from 'express';
import { fetchGeminiData } from '../api/geminiApi.js';
import { queryPineconeForProfessor } from '../service/pineconeService.js';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    // Use Gemini AI to analyze and refine the user query
    const refinedQuery = await fetchGeminiData(`Refine this search query for professor recommendations: ${userMessage}`);

    // Query Pinecone using the refined query
    const professorRecommendations = await queryPineconeForProfessor(refinedQuery);

    // Use Gemini AI to generate personalized recommendations based on Pinecone results
    const personalizedRecommendations = await fetchGeminiData(`
      Generate personalized professor recommendations based on these results: 
      ${JSON.stringify(professorRecommendations)}
      
      Format the response as a JSON array of objects, each containing:
      - name: professor's name
      - department: professor's department
      - rating: professor's rating
      - recommendation: a brief personalized recommendation
    `);

    // Parse the Gemini response and send it back to the client
    const formattedRecommendations = JSON.parse(personalizedRecommendations);
    res.json({ reply: JSON.stringify(formattedRecommendations) });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process your request. Please try again.' });
  }
});

export default router;
