from playwright.sync_api import sync_playwright
import time

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Load the page
        print("Navigating to app...")
        page.goto("http://localhost:3000/index.html")
        time.sleep(2) # Allow map to init

        # 2. Screenshot Introduction
        print("Capturing Intro...")
        page.screenshot(path="verification/1_intro_desktop.png")

        # 3. Enter App
        print("Clicking Introduction...")
        page.click("#introduction")
        time.sleep(2) # Wait for fade and map

        # 4. Screenshot Map
        print("Capturing Map...")
        page.screenshot(path="verification/2_map_desktop.png")

        # 5. Toggle Tactical Mode
        print("Toggling Tactical Mode...")
        page.click("#tactical-toggle")
        time.sleep(1)
        page.screenshot(path="verification/3_tactical_desktop.png")

        # 6. Click a Marker (Try to find one)
        print("Clicking a Marker...")
        # Markers are div icons. We need a selector.
        # In app.js: className: 'leaflet-marker-icon'
        markers = page.locator(".leaflet-marker-icon")
        count = markers.count()
        print(f"Found {count} markers")
        if count > 0:
            markers.first.click()
            time.sleep(2)
            print("Capturing Info Panel...")
            page.screenshot(path="verification/4_info_panel_desktop.png")

            # 7. Check if image loaded or fallback (look for .loading class removal)
            # app.js removes .loading class on load
            try:
                page.wait_for_selector("#panel-image:not(.loading)", timeout=5000)
                print("Image loaded successfully.")
            except:
                print("Image load timeout or error.")

            # 8. Close Panel
            page.click("#close-panel")
            time.sleep(1)

        # 9. Mobile Emulation
        print("Testing Mobile View...")
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 812}, is_mobile=True)
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:3000/index.html")
        time.sleep(1)
        page_mobile.click("#introduction")
        time.sleep(2)
        page_mobile.screenshot(path="verification/5_map_mobile.png")

        # Open filters
        # In mobile, filters are horizontal scroll.

        browser.close()

if __name__ == "__main__":
    verify_app()
