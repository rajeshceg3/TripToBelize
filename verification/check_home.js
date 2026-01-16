const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto("http://localhost:8080");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "verification/homepage.png" });
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
