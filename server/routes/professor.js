import express from 'express';
import { addProfessorToPinecone } from '../service/pineconeService.js';

const router = express.Router();

router.post('/api/add-professor', async (req, res) => {
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

export default router;
