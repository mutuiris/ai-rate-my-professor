import { addProfessorToPinecone } from '../service/pineconeService.js';
import { scrapeProfessorData } from '../service/scraper.js';

// Function to scrape Professor's page and store in Pinecone
export async function processProfessorPage(url) {
  try {
    // Scrape the professor data from the given url
    const professorData = await scrapeProfessorData(url);

    // Format data to be stored in Pinecone
    const formattedData = {
      id: `prof_${Date.now()}`, //Create a unique ID for the professor
      name: professorData.name,
      department: professorData.department,
      rating: parseFloat(professorData.rating), // Converting rating to a float if necessary
      review: professorData.reviews.join(' ') // Combine all reviews into a string
    };

    // Store the formatted data in Pinecone
    await addProfessorToPinecone(formattedData);
    console.log(`Successfully added ${professorData.name} to Pinecone!`);
  } catch (error) {
    console.error('Error processing professor page:', error);
    throw error;
  }
}