import express from "express";
import { scrapeProfessorData } from "../service/scraper.js";

const router = express.Router();

router.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await scrapeProfessorData(url);

    res.status(200).json({
      message: "Professor data scraped and stored successfully",
      data: result,
    });
  } catch (error) {
    console.error("Scraping error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (error.name === "ScrapingError") {
      return res
        .status(422)
        .json({ error: "Unable to scrape data from the provided URL" });
    }

    if (error.name === "StorageError") {
      return res.status(500).json({ error: "Failed to store scraped data" });
    }

    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export default router;
