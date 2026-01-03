from playwright.sync_api import sync_playwright

def verify_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080")

        # Dismiss Introduction
        page.click("#introduction")
        # Wait for intro to fade out (it has 1.2s transition and setTimeout 500ms for map init)
        page.wait_for_timeout(2000)

        # Wait for map to load
        page.wait_for_selector("#map")

        # 1. Verify "Tactical Mode" toggle interaction
        tactical_btn = page.locator("#tactical-toggle")
        tactical_btn.click()

        # Wait for overlay visual change (class addition)
        page.wait_for_selector(".tactical-mode-active")

        # 2. Add an expedition target to trigger HUD
        # Click a marker (simulate by invoking JS or finding marker)
        # Since markers are canvas/divs, let's execute JS to simulate a click on a marker
        page.evaluate("""
            const marker = document.querySelector('.leaflet-marker-icon');
            if(marker) marker.click();
        """)

        # Wait for info panel
        page.wait_for_selector("#info-panel.visible")

        # Click "Initialize Target"
        page.click("#btn-add-expedition")

        # 3. Add a second target to enable simulation
        # Close panel first to see map
        page.click("#close-panel")
        page.wait_for_timeout(500) # Wait for animation

        # Click another marker (index 1)
        page.evaluate("""
            const markers = document.querySelectorAll('.leaflet-marker-icon');
            if(markers.length > 1) markers[1].click();
        """)

        page.wait_for_selector("#info-panel.visible")
        page.click("#btn-add-expedition")

        # 4. Generate Brief (Tests LogisticsCore integration)
        page.click("#btn-generate-brief")
        page.wait_for_selector("#briefing-modal.visible")

        # Take screenshot of the Briefing Modal which shows risk assessment
        page.screenshot(path="verification/briefing_modal.png")
        print("Briefing Modal screenshot taken.")

        # Close brief using Escape key since click was flaky
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

        # 5. Simulate Mission (Tests Pathfinder Integration)
        # Ensure tactical mode is on to see the heatmap
        # Check if active class is present
        classes = tactical_btn.get_attribute("class") or ""
        if "active" not in classes:
            tactical_btn.click()

        page.click("#btn-simulate-mission")

        # Wait for simulation to start (Mission Control visible)
        page.wait_for_selector("#mission-control.visible")

        # Wait a bit for the simulation to tick and visuals to appear
        page.wait_for_timeout(2000)

        # Take screenshot of the Simulation in action (showing heatmap if possible)
        page.screenshot(path="verification/simulation_active.png")
        print("Simulation screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_features()
