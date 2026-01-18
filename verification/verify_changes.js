
const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Go to the app
    await page.goto('http://localhost:8080');

    // 2. Click Introduction to enter
    await page.click('#introduction');

    // Wait for map to load (panel to hide if it was visible, but initially intro covers it)
    await page.waitForTimeout(2000);

    // 3. Select 2 targets to enable simulation (and generate briefing)
    // Markers are div icons with no text content in DOM usually, but we added aria-labels in app.js
    // Let's find markers by aria-label. The data has "Great Blue Hole" and others.

    // We need to click on the map markers.
    // L.marker elements have role="button" and aria-label.
    const marker1 = page.locator('div.leaflet-marker-icon[aria-label="Great Blue Hole"]');
    // Using a simpler name found in the file, and likely on screen
    const marker2 = page.locator('div.leaflet-marker-icon[aria-label="Cockscomb Basin"]');

    await marker1.click();
    await page.waitForTimeout(500);
    // Click "Initialize Target" in the panel
    await page.click('#btn-add-expedition');
    await page.waitForTimeout(500);

    // Close panel to click another
    await page.click('#close-panel');
    await page.waitForTimeout(500);

    await marker2.click();
    await page.waitForTimeout(500);
    await page.click('#btn-add-expedition');

    // 4. Generate Briefing
    await page.click('#btn-generate-brief');
    await page.waitForTimeout(1000);

    // 5. Save Scenario to Archives
    await page.click('#btn-save-scenario');
    // Toast appears
    await page.waitForTimeout(2000); // Wait for toast and modal close?
    // btn-save-scenario closes modal in app.js: Utils.showToast... closeBriefingModal()

    // 6. Open Archives
    // The Archives button is dynamically added to #filter-container
    const archivesBtn = page.locator('button.archives-btn');
    await archivesBtn.click();
    await page.waitForTimeout(1000);

    // 7. Select the first archive
    await page.click('#archives-list .target-row');
    await page.waitForTimeout(500);

    // 8. Click Delete button
    const deleteBtn = page.locator('button.archives-btn-delete');
    await deleteBtn.click();

    // 9. Verify "Confirm?" state
    await expect(deleteBtn).toHaveText('Confirm?');

    // Take screenshot of the confirmation state
    await page.screenshot({ path: 'verification/verification_screenshot.png' });

    console.log("Verification successful: Screenshot taken.");

  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
