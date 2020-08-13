const puppeteer = require("puppeteer");

async function scrapeRandomA11y() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://randoma11y.com");

    await page.waitForSelector("h3");
    const colorHexValues = await page.$$eval("h3", colorNameEl =>
      colorNameEl.map(el => el.textContent)
    );

    const hasCorrectishHexValues = colorHexValues.every(value =>
      value.includes("#")
    );

    if (!hasCorrectishHexValues) {
      throw new Error(
        `Incorrect data scraped... ${JSON.stringify({ colorHexValues })}`
      );
    }

    const [color_one, color_two] = colorHexValues;
    return { color_one, color_two };
  } catch (error) {
    throw new Error(error.message);
  } finally {
    if (browser && browser.close) {
      await browser.close();
    }
  }
}

module.exports = {
  scrapeRandomA11y
};
