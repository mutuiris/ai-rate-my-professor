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

export async function queryPineconeForProfessor(userQuery) {
  try {
    // Initialize Pinecone index
    const index = pc.Index('rag');

    // Generate embeddings for user query
    const queryVector = await getEmbeddings(userQuery);

    // Query Pinecone for similar professor data
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    // Extract the results and return them
    const results = queryResponse.matches.map(match => ({
      name: match.metadata.name,
      department: match.metadata.department,
      rating: match.metadata.rating,
      similarity: match.score, // Similarity score from Pinecone
    }));
    return results;
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw error;
  }
}