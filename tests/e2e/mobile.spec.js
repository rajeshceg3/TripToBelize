const { test, expect } = require('@playwright/test');

test.describe('Mobile UX [E2E]', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile Viewport

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#introduction').click();
  });

  test('should use bottom sheet for info panel on mobile', async ({ page }) => {
    const markers = page.locator('.leaflet-marker-icon');
    await markers.nth(0).click();

    const panel = page.locator('#info-panel');
    await expect(panel).toBeVisible();

    // Check styles or class that indicate bottom sheet?
    // Usually handled by CSS media queries, but we can check position
    const box = await panel.boundingBox();
    expect(box.y).toBeGreaterThan(0); // Should be at bottom
    expect(box.width).toBe(375); // Full width
  });

  test('should allow dragging to dismiss panel', async ({ page }) => {
     // This is hard to test deterministically without specialized drag actions
     // But we can try
     const markers = page.locator('.leaflet-marker-icon');
     await markers.nth(0).click();

     const panel = page.locator('#info-panel');
     await expect(panel).toBeVisible();

     const handle = page.locator('.drag-handle');
     if (await handle.isVisible()) {
         // Drag down
         await handle.hover();
         await page.mouse.down();
         await page.mouse.move(375/2, 600); // Move down
         await page.mouse.up();

         await expect(panel).not.toHaveClass(/open/);
     }
  });
});
