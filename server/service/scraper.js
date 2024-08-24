import puppeteer from "puppeteer";

export async function scrapeProfessorData(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // Increase timeout to 60 seconds

    await page.goto(url, { waitUntil: 'networkidle0' });

    const professorData = await page.evaluate(() => {
      // Helper function to find text by keywords
      const findTextByKeywords = (keywords) => {
        for (const keyword of keywords) {
          const element = document.evaluate(
            `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${keyword.toLowerCase()}')]`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          if (element) {
            return element.innerText.trim();
          }
        }
        return null;
      };

      // Find the professor's name
      const nameKeywords = ['professor', 'dr.', 'prof.', 'name:'];
      const name = findTextByKeywords(nameKeywords) || document.querySelector('h1')?.innerText?.trim() || 'Unknown Professor';

      // Find department
      const departmentKeywords = ['department', 'dept.', 'subject', 'faculty', 'school of'];
      const department = findTextByKeywords(departmentKeywords);

      const ratings = document.querySelector('.ratings')?.innerText;
      const reviews = Array.from(document.querySelectorAll('.review')).map(review => review.innerText);

      return { name, department, ratings, reviews };
    });

    if (professorData.name === 'Unknown Professor' && !professorData.department) {
      throw new Error('Unable to scrape professor data');
    }

    return professorData;
  } catch (error) {
    console.error("Scraping error:", error);
    throw { name: 'ScrapingError', message: error.message, url };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
