const { test, expect } = require('@playwright/test');

test.describe('Mission Operation [E2E]', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Bypass Intro
    const intro = page.locator('#introduction');
    if (await intro.isVisible()) {
        await intro.click();
        await expect(intro).toHaveClass(/hidden/);
    }
    await expect(page.locator('#map')).toBeVisible();
  });

  test('should load map and tactical markers', async ({ page }) => {
    await page.waitForSelector('.leaflet-marker-icon', { state: 'visible', timeout: 15000 });
    const markers = page.locator('.leaflet-marker-icon');
    expect(await markers.count()).toBeGreaterThan(0);
  });

  test('should allow mission planning and simulation', async ({ page, isMobile }) => {
    test.setTimeout(45000);

    await page.waitForSelector('.leaflet-marker-icon', { state: 'visible', timeout: 15000 });

    // Switch to ruins to filter down
    await page.locator('button[data-filter="ruins"]').click();
    await page.waitForTimeout(500);

    const visibleMarkers = page.locator('.leaflet-marker-icon:not(.dimmed)');
    const count = await visibleMarkers.count();

    // Helper to click add button
    const addToExpedition = async () => {
         // The button is inside info-panel.
         // Playwright says element is outside viewport if the panel is off-canvas or clipped.
         // We can use JS click.
         await page.evaluate(() => {
             const btn = document.getElementById('btn-add-expedition');
             if(btn) btn.click();
         });

         // Wait for UI update (button text change)
         await expect(page.locator('#btn-add-expedition')).toHaveText('Remove Target', { timeout: 2000 });
    };

    // Click 1st visible marker
    if (count > 0) {
        // Remove force: true to ensure real user interaction is simulated
        await visibleMarkers.first().click();

        const panel = page.locator('#info-panel');
        await expect(panel).toBeVisible({ timeout: 5000 });
        await expect(panel).toHaveClass(/visible/);

        await addToExpedition();

        const closeBtn = page.locator('#close-panel');
        await expect(closeBtn).toBeVisible();
        await closeBtn.click();
    }

    // Click 2nd visible marker
    if (count > 1) {
         // Wait for panel to close
         const panel = page.locator('#info-panel');
         await expect(panel).not.toHaveClass(/visible/);
         // Allow animation to complete (CSS transition 0.6s) to prevent click interception or state overlap
         await page.waitForTimeout(700);

         await visibleMarkers.nth(1).click();
         await expect(panel).toBeVisible({ timeout: 5000 });
         await expect(panel).toHaveClass(/visible/);

         await addToExpedition();
         const closeBtn = page.locator('#close-panel');
         await expect(closeBtn).toBeVisible();
         await closeBtn.click();
    } else {
        // Fallback
        await page.locator('button[data-filter="all"]').click();
        await page.waitForTimeout(500);

        const panel = page.locator('#info-panel');
        await expect(panel).not.toHaveClass(/visible/);

        await page.locator('.leaflet-marker-icon').nth(2).click();
        await expect(panel).toBeVisible({ timeout: 5000 });
        await expect(panel).toHaveClass(/visible/);

        await addToExpedition();
        const closeBtn = page.locator('#close-panel');
        await expect(closeBtn).toBeVisible();
        await closeBtn.click();
    }

    // Check HUD count
    await expect(page.locator('#expedition-count')).toContainText('2 Targets');

    // Click Simulate
    const simBtn = page.locator('.simulate-btn');
    await expect(simBtn).toBeVisible();
    await simBtn.click({ force: true });

    // Verify Log
    await expect(page.locator('#mc-log-container')).toContainText('Mission Simulation Initialized', { timeout: 10000 });
  });

  test('should show tactical overlay toggle', async ({ page }) => {
      const toggle = page.locator('#tactical-toggle');
      await expect(toggle).toBeVisible();

      await page.waitForTimeout(1000);
      await toggle.click();

      await expect(toggle).toHaveClass(/active/);
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display info panel when marker clicked', async ({ page }) => {
      await page.waitForSelector('.leaflet-marker-icon', { state: 'visible', timeout: 15000 });
      const markers = page.locator('.leaflet-marker-icon');

      await markers.nth(0).click({ force: true });

      const panel = page.locator('#info-panel');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveClass(/visible/);

      await expect(page.locator('#panel-title')).not.toBeEmpty();
  });
});
