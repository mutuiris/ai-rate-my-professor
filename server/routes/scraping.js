import express from "express";
import { scrapeProfessorData } from "../service/scraper.js";
import { fetchGeminiData } from "../api/geminiApi.js";

const router = express.Router();

router.post("/api/scrape", async (req, res) => {
  try {
    const { url, query } = req.body;

    if (!url || !query) {
      return res.status(400).json({ error: "URL and query are required" });
    }

    const scrapedData = await scrapeProfessorData(url);
    const aiResponse = await fetchGeminiData(`${query}\n\nContext: ${JSON.stringify(scrapedData)}`);

    res.status(200).json({
      message: "Website scraped and processed successfully",
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "An unexpected error occurred during scraping and processing" });
  }
});

export default router;
