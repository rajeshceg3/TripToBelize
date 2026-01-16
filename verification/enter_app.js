const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on("console", msg => logs.push(msg.type() + ": " + msg.text()));
  page.on("pageerror", err => logs.push("error: " + err.message));

  try {
    await page.goto("http://localhost:8080");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "verification/step1_splash.png" });

    // Click introduction
    await page.click("#introduction");
    await page.waitForTimeout(1000); // Wait for transition
    await page.screenshot({ path: "verification/step2_map.png" });

    // Click a marker (Great Blue Hole is index 0 usually, but let's find one)
    // Wait for markers to appear
    await page.waitForSelector(".leaflet-marker-icon");
    const markers = await page.$$(".leaflet-marker-icon");
    if (markers.length > 0) {
        await markers[0].click();
        await page.waitForSelector("#info-panel.visible");
        await page.waitForTimeout(500);
        await page.screenshot({ path: "verification/step3_details.png" });
    }

  } catch (e) {
    console.error(e);
    logs.push("SCRIPT ERROR: " + e.message);
  } finally {
    require("fs").writeFileSync("verification/logs.txt", logs.join("\n"));
    await browser.close();
  }
})();
