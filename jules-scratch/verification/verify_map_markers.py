import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the local HTML file
        file_path = os.path.abspath('index.html')
        await page.goto(f'file://{file_path}')

        # Click the introduction to reveal the map
        await page.locator('#introduction').click()

        # Wait for the map to initialize and markers to be added
        # We expect 15 markers based on the locations array in the HTML
        await expect(page.locator('.leaflet-marker-icon')).to_have_count(15, timeout=10000)

        # Wait for animations to settle
        await page.wait_for_timeout(2000)

        # Take a screenshot
        await page.screenshot(path='jules-scratch/verification/verification.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
