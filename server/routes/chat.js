import express from "express";
import { fetchGeminiData } from "../api/geminiApi.js";
import { queryPineconeForProfessor } from "../service/pineconeService.js";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const router = express.Router();

router.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.body.userId;

  function isGreetingOrGeneralQuestion(message) {
    const greetings = [
      "hi",
      "hello",
      "hey",
      "greetings",
      "good morning",
      "good afternoon",
      "good evening",
    ];
    return (
      greetings.some((greeting) => message.toLowerCase().includes(greeting)) ||
      message.toLowerCase().includes("how are you")
    );
  }

  try {
    let response;
    let replyType = "general";

    if (isGreetingOrGeneralQuestion(userMessage)) {
      response = await fetchGeminiData(
        `Respond to this message: ${userMessage}`
      );
    } else {
      const refinedQuery = await fetchGeminiData(
        `Refine this search query for professor recommendations: ${userMessage}`
      );
      console.log("Refined Query:", refinedQuery);

      const professorRecommendations = await queryPineconeForProfessor(
        refinedQuery
      );
      console.log("Pinecone Recommendations:", professorRecommendations);

      const personalizedRecommendations = await fetchGeminiData(`
        Based on these professor results: ${JSON.stringify(
          professorRecommendations
        )}
        
        Answer the following query: ${userMessage}
        
        If the query is asking for a specific ranking (e.g., lowest or highest rated), provide that information first.
        Then, provide up to 5 relevant professor recommendations.
        
        Format the response as a valid JSON object containing:
        - answer: a direct answer to the query
        - recommendations: an array of up to 5 professor objects, each containing:
          - name: professor's name
          - department: professor's department (use "N/A" if not available)
          - rating: professor's rating (as a number)
          - recommendation: a brief personalized recommendation
        
        Ensure the response is a properly formatted JSON string without any additional text.
      `);

      console.log("Raw Gemini Response:", personalizedRecommendations);

      let formattedResponse;
      try {
        const cleanedResponse = personalizedRecommendations
          .replace(/```json\n|\n```/g, "")
          .trim();
        formattedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Problematic JSON string:", personalizedRecommendations);
        throw new Error(
          "We're having trouble processing the response. Please try your request again."
        );
      }

      if (
        !formattedResponse.answer ||
        !Array.isArray(formattedResponse.recommendations)
      ) {
        throw new Error(
          "Invalid response format. Please try your request again."
        );
      }

      // Validate each recommendation object
      formattedResponse.recommendations.forEach((rec, index) => {
        if (!rec.name || rec.rating === undefined || !rec.recommendation) {
          throw new Error(
            `We're missing some information for one of the recommendations. Please try your request again.`
          );
        }
        rec.department = rec.department || "N/A";
        if (typeof rec.rating !== "number") {
          rec.rating = parseFloat(rec.rating);
          if (isNaN(rec.rating)) {
            throw new Error(
              `We encountered an issue with a professor's rating. Please try your request again.`
            );
          }
        }
      });

      response = {
        reply: [
          { type: "answer", text: formattedResponse.answer },
          ...formattedResponse.recommendations.map((rec) => ({
            ...rec,
            type: "recommendation",
          })),
        ],
      };
      replyType = "recommendation";
    }

    // Store chat history in Firestore
    if (userId) {
      await addDoc(collection(db, "chatHistory"), {
        userId,
        userMessage,
        response,
        replyType,
        timestamp: new Date(),
      });
    } else {
      console.warn("Chat history not saved: userId is undefined");
    }

    res.json(response);
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({
      reply: [
        {
          text: "I'm sorry, but I couldn't process your request at this time. Please try again or rephrase your question.",
          type: "error",
        },
      ],
    });
  } finally {
    console.log("Chat request processing completed");
  }
});

// Route to retrieve chat history
router.get("/api/chat/history", async (req, res) => {
  const userId = req.query.userId;

  try {
    const q = query(
      collection(db, "chatHistory"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const chatHistory = querySnapshot.docs.map((doc) => doc.data());

    return res.json({ chatHistory });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve chat history. Please try again." });
  }
});

export default router;
