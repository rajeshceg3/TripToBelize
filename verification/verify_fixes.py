
from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto("http://localhost:8080/index.html")

    # Click introduction to enter
    intro = page.locator("#introduction")
    intro.click()

    # Wait for map to init
    page.wait_for_timeout(2000)

    # Check Simulate Button contrast/existence
    sim_btn = page.locator("#btn-simulate-mission")
    if sim_btn.is_visible():
        print("Simulate button visible")

    # Check if tactical toggle exists
    tactical_toggle = page.locator("#tactical-toggle")
    tactical_toggle.click()
    page.wait_for_timeout(1000)

    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_app(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
