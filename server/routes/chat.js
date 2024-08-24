import express from "express";
import { fetchGeminiData } from "../api/geminiApi.js";
import { queryPineconeForProfessor } from "../service/pineconeService.js";

const router = express.Router();

router.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    // Check if it's a greeting or general question
    if (isGreetingOrGeneralQuestion(userMessage)) {
      const response = await fetchGeminiData(`Respond to this message: ${userMessage}`);
      return res.json({ reply: response });
    }

    const refinedQuery = await fetchGeminiData(
      `Refine this search query for professor recommendations: ${userMessage}`
    );
    console.log("Refined Query:", refinedQuery);

    const professorRecommendations = await queryPineconeForProfessor(
      refinedQuery
    );
    console.log("Pinecone Recommendations:", professorRecommendations);

    const personalizedRecommendations = await fetchGeminiData(`
      Generate personalized professor recommendations based on these results:
      ${JSON.stringify(professorRecommendations)}
      
      Format the response as a valid JSON array of objects, each containing:
      - name: professor's name
      - department: professor's department (use "N/A" if not available)
      - rating: professor's rating (as a number)
      - recommendation: a brief personalized recommendation
      
      Ensure the response is a properly formatted JSON string without any additional text before or after the JSON data.
      The response should contain exactly 5 professor recommendations.
      Do not use markdown formatting in your response.
    `);

    console.log("Raw Gemini Response:", personalizedRecommendations);

    let formattedRecommendations;
    try {
      const cleanedResponse = personalizedRecommendations.replace(/```json\n|\n```/g, '').trim();
      formattedRecommendations = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Problematic JSON string:", personalizedRecommendations);
      throw new Error("Invalid JSON format in response: " + parseError.message);
    }

    if (
      !Array.isArray(formattedRecommendations) ||
      formattedRecommendations.length !== 5
    ) {
      throw new Error("Invalid response format or incorrect number of recommendations");
    }

    // Validate each recommendation object
    formattedRecommendations.forEach((rec, index) => {
      if (!rec.name || rec.rating === undefined || !rec.recommendation) {
        throw new Error(`Missing required fields in recommendation at index ${index}`);
      }
      rec.department = rec.department || "N/A";
      if (typeof rec.rating !== 'number') {
        rec.rating = parseFloat(rec.rating);
        if (isNaN(rec.rating)) {
          throw new Error(`Invalid rating format for recommendation at index ${index}`);
        }
      }
    });

    res.json({ reply: formattedRecommendations });
  } catch (error) {
    console.error("Error processing chat request:", error);
    res
      .status(500)
      .json({ error: "Failed to process your request. Please try again.", details: error.message });
  } finally {
    console.log("Chat request processing completed");
  }
});

function isGreetingOrGeneralQuestion(message) {
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(greeting => message.toLowerCase().includes(greeting)) || 
         message.toLowerCase().includes('how are you');
}

export default router;