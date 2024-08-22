import pc from '../config/pinecone.js';
import { getEmbeddings } from './embeddingService.js';

// Function to add Professor data to Pinecone
export async function addProfessorToPinecone(professorData) {
  try {
    // Initialize Pinecone index
    const index = pc.Index('rag');

    // Generate embeddings for professor review text
    const vector = await getEmbeddings(professorData.reviewText);

    // Prepare data to be stored in Pinecone
    const pineconeData = {
      id: professorData.id,
      values: vector,
      metadata: {
        name: professorData.name,
        department: professorData.department,
        rating: professorData.rating,
      }
    };
    // Upsert (add or update) the data to Pinecone
    await index.upsert([pineconeData]);
    console.log('Professor data added to Pinecone successfully.');
  } catch (error) {
    console.error('Error adding professor to Pinecone:', error);
    throw error;
  }
}