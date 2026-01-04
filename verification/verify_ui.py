
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate desktop
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Load the local file
        path = os.path.abspath("index.html")
        page.goto(f"file://{path}")

        # Wait for the intro to appear
        page.wait_for_selector("#introduction")

        # Click the intro to start
        page.click("#introduction")

        # Wait for map and UI
        page.wait_for_selector("#filter-container", state="visible")
        page.wait_for_timeout(2000) # Wait for animations

        # Screenshot Desktop
        page.screenshot(path="verification/desktop_view.png")

        # --- Mobile Simulation ---
        context_mobile = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
            is_mobile=True
        )
        page_mobile = context_mobile.new_page()
        page_mobile.goto(f"file://{path}")

        page_mobile.click("#introduction")
        page_mobile.wait_for_selector("#filter-container", state="visible")
        page_mobile.wait_for_timeout(2000)

        # Click a marker to show bottom sheet
        # Leaflet markers are divs with class 'leaflet-marker-icon'
        # We need to wait for them to render
        page_mobile.wait_for_selector(".leaflet-marker-icon")
        markers = page_mobile.locator(".leaflet-marker-icon")
        # Click the first one
        if markers.count() > 0:
            markers.first.click()
            page_mobile.wait_for_selector("#info-panel.visible")
            page_mobile.wait_for_timeout(1000)

        page_mobile.screenshot(path="verification/mobile_view.png")

        browser.close()

if __name__ == "__main__":
    run()
