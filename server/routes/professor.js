import express from 'express';
import { addProfessorToPinecone } from '../service/pineconeService.js';
import { querySentimentTrends } from '../service/pineconeService.js';

const router = express.Router();

router.post('api/add-professor', async (req, res) => {
  try {
    const professorData = req.body;
    console.log('Received professor data:', professorData);

    if (Array.isArray(professorData)) {
      for (const professor of professorData) {
        await addProfessorToPinecone(professor);
      }
    } else {
      await addProfessorToPinecone(professorData);
    }

    res.json({ success: 'Professor data added to Pinecone successfully.' });
  } catch (error) {
    console.error('Error in /api/add-professor route:', error);
    res.status(500).json({ error: 'Failed to add professor to Pinecone', details: error.message });
  }
});

router.get('api/sentiment-trends/:professorName', async (req, res) => {
  const { professorName } = req.params;

  try {
    // Query Pinecone for sentiment trends for the given professor
    const trendData = await querySentimentTrends(professorName);
    res.status(200).json({ trends: trendData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sentiment trends.', details: error.message });
  }
});

export default router;
