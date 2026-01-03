from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # Open the file locally
        cwd = os.getcwd()
        page.goto(f'file://{cwd}/index.html')

        # Click through introduction
        page.locator('#introduction').click()
        page.wait_for_timeout(1000) # Wait for animation

        # Check filters (A11y check)
        ruins_btn = page.locator('button[data-filter="ruins"]')
        # Verify aria-pressed is initially false
        val1 = ruins_btn.get_attribute('aria-pressed')
        print(f'Initial state: {val1}')

        ruins_btn.click()
        # Verify aria-pressed is now true
        val2 = ruins_btn.get_attribute('aria-pressed')
        print(f'Clicked state: {val2}')

        # Take screenshot of map with filter active
        page.screenshot(path='verification/ux_check.png')
        browser.close()

if __name__ == '__main__':
    run()
