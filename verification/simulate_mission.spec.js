
const { test, expect } = require('@playwright/test');

test.describe('Mission Simulation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the app
    await page.goto('http://localhost:8080');
    // Start experience
    await page.click('#introduction');
    // Wait for map
    await page.waitForTimeout(1000);
  });

  test('should initialize mission and handle pause correctly', async ({ page }) => {
    // 1. Add targets (need at least 2)
    // Click markers. Since they are leaflet markers, we need to find them.
    // We can simulate clicks via page.evaluate or clicking the DOM elements if they have proper selectors.
    // The markers have class 'leaflet-marker-icon'.

    // Select first marker
    await page.locator('.leaflet-marker-icon').nth(0).click();
    await page.waitForSelector('#btn-add-expedition');
    await page.click('#btn-add-expedition');
    await page.click('#close-panel');

    // Select second marker
    await page.locator('.leaflet-marker-icon').nth(1).click();
    await page.waitForSelector('#btn-add-expedition');
    await page.click('#btn-add-expedition');
    await page.click('#close-panel');

    // Open HUD (it might be hidden on mobile, but visible on desktop? It slides in.)
    // We need to click the toggle or ensure it's visible.
    // The HUD is #expedition-hud. It has class 'visible' if targets > 0.
    await expect(page.locator('#expedition-hud')).toHaveClass(/visible/);

    // Click Simulate
    await page.click('#btn-simulate-mission');

    // Check if Mission Control is visible
    await expect(page.locator('#mission-control')).toHaveClass(/visible/);

    // Check if Sim is running (Timer should change)
    const timer = page.locator('#mc-timer');
    const time1 = await timer.textContent();
    await page.waitForTimeout(2000);
    const time2 = await timer.textContent();
    expect(time1).not.toBe(time2);

    // Test Pause Button
    await page.click('#btn-mc-pause');
    const pauseText = await page.locator('#btn-mc-pause').textContent();
    expect(pauseText).toBe('Resume');

    // Wait to ensure timer stops
    const timePaused1 = await timer.textContent();
    await page.waitForTimeout(2000);
    const timePaused2 = await timer.textContent();
    expect(timePaused1).toBe(timePaused2);

    // Resume
    await page.click('#btn-mc-pause');
    const resumeText = await page.locator('#btn-mc-pause').textContent();
    expect(resumeText).toBe('Pause');
  });

  test('should handle Overwatch reroute without double-toggle issue', async ({ page }) => {
     // This test tries to reproduce the logic bug where Overwatch pauses and App.js pauses again.

     // Setup mission
     await page.locator('.leaflet-marker-icon').nth(0).click();
     await page.click('#btn-add-expedition');
     await page.click('#close-panel');
     await page.locator('.leaflet-marker-icon').nth(2).click(); // Use different one
     await page.click('#btn-add-expedition');
     await page.click('#close-panel');
     await page.click('#btn-simulate-mission');

     // Inject a custom event to trigger Overwatch alert manually
     await page.evaluate(() => {
        const event = new CustomEvent('overwatch-alert', {
            detail: {
                threat: { message: "TEST THREAT", severity: "CRITICAL", radius: 5, location: {lat: 17, lng: -88}, riskModifier: 50 },
                action: 'REROUTE_REQUIRED'
            }
        });
        window.dispatchEvent(event);
     });

     // The App logic:
     // 1. Alert (Toast)
     // 2. 1.5s delay -> executeReroute
     // 3. 1.0s delay -> missionSimulator.pause() (Toggle)

     // Wait for the sequence to complete (approx 3s)
     await page.waitForTimeout(3000);

     // Check status. If the bug exists:
     // Overwatch paused it.
     // App.js paused it again -> RESUMED it.
     // So it should be RUNNING.

     // If the fix is applied (or if my understanding is wrong), it should be PAUSED or RUNNING depending on intent.
     // The intent seems to be to Resume after reroute?
     // Code: "setTimeout(() => { missionSimulator.pause(); }, 1000);"
     // If it was paused by Overwatch, this resumes it.
     // BUT, executeReroute might have side effects?

     // Let's check the button text. If it's running, button says "Pause". If paused, "Resume".
     const btnText = await page.locator('#btn-mc-pause').textContent();

     console.log('Button Text after Reroute:', btnText);

     // If the bug makes it resume immediately without user input, we might consider that a feature or a bug.
     // However, the comment in Overwatch says "We'll let the UI confirm the reroute before applying it" (which is not implemented)
     // and "leaves it paused for user to resume".
     // So if it auto-resumes, that violates the "leaves it paused" intent.

     expect(btnText).toBe('Resume'); // Expect it to remain PAUSED
  });
});
