
from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to local server
        page.goto("http://localhost:8080")

        # Click through introduction
        page.click("#introduction")

        # Wait for map to initialize (simulate-btn exists)
        page.wait_for_selector(".simulate-btn", state="visible")

        # Check simulate button style (contrast fix)
        # We can't easily check computed style in screenshot, but we can visually verify
        page.screenshot(path="verification/simulate_btn_contrast.png")

        # Verify MissionSimulator logic fix by running a simulation
        # 1. Add targets
        # Click a marker to open panel
        # Wait for markers to be interactive
        page.wait_for_timeout(2000)

        # Click on Great Blue Hole (first marker usually, or find by title)
        # Markers are divIcons.
        markers = page.locator(".leaflet-marker-icon")
        count = markers.count()
        print(f"Found {count} markers")

        if count > 0:
            markers.first.click()
            page.wait_for_selector("#info-panel.visible")
            page.click("#btn-add-expedition")

            # Close panel
            page.click("#close-panel")
            page.wait_for_timeout(500)

            # Click another marker
            markers.nth(1).click()
            page.wait_for_selector("#info-panel.visible")
            page.click("#btn-add-expedition")
            page.click("#close-panel")

            # Check if Simulate button is visible (it is in HUD)
            # HUD should be visible
            page.wait_for_selector("#expedition-hud.visible")

            # Click Simulate
            page.click("#btn-simulate-mission")

            # Wait for Mission Control
            page.wait_for_selector("#mission-control.visible")

            # Take screenshot of simulation start
            page.screenshot(path="verification/simulation_start.png")

            # Wait for logs to appear
            page.wait_for_timeout(5000)
            page.screenshot(path="verification/simulation_running.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
