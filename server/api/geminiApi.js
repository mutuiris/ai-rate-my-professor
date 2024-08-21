import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/* CONFIGURATION OF API */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_BASE_URL = process.env.GEMINI_API_BASE_URL;

export async function fetchGeminiData(query) {
  try {
    const response = await axios.get(`${GEMINI_API_BASE_URL}/data?query=${query}`, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      }
    });
  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
    throw error;
  }
}