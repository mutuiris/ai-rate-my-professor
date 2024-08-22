import puppeteer from "puppeteer";

export async function scrapeProfessorData(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const professorData = await page.evaluate(() => {
      const name = document.querySelector('h1')?.innerText;
      const department = document.querySelector('.department')?.innerText;
      const ratings = document.querySelector('.ratings')?.innerText;
      const reviews = Array.from(document.querySelectorAll('.review')).map(review => review.innerText);

      return { name, department, ratings, reviews };
    });

    await browser.close();

    if (!professorData.name) {
      throw new Error('Unable to scrape professor data');
    }

    return professorData;
  } catch (error) {
    console.error("Scraping error:", error);
    throw { name: 'ScrapingError', message: error.message };
  }
}