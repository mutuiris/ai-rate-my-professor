import express from 'express';
import { addProfessorToPinecone } from '../service/pineconeService';

const router = express.Router();

router.post('/api/add-professor', async (req, res) => {
  try {
    const professorData = req.body;
    await addProfessorToPinecone(professorData);
    res.json({ success: 'Professor data added to Pinecone successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add professor to Pinecone' });
  }
});

export default router;