
from playwright.sync_api import sync_playwright

def verify_tactical_alert(page):
    try:
        # Load index.html locally
        page.goto("file:///app/index.html")

        # Click Introduction
        page.get_by_role("button", name="Start Application").click()
        page.wait_for_timeout(2000) # Wait for map

        # Force click markers using JS to avoid viewport issues
        # Select first marker
        page.evaluate("""
            const markers = document.querySelectorAll(".leaflet-marker-icon");
            if(markers.length > 0) markers[0].click();
        """)

        # Wait for panel
        page.wait_for_selector("#info-panel.visible", timeout=5000)
        page.wait_for_timeout(1000)

        # Click "Initialize Target"
        btn = page.locator("#btn-add-expedition")
        btn.click()

        # Close panel
        page.keyboard.press("Escape")
        page.wait_for_timeout(1000)

        # Select second marker
        page.evaluate("""
            const markers = document.querySelectorAll(".leaflet-marker-icon");
            if(markers.length > 1) markers[1].click();
        """)

        page.wait_for_selector("#info-panel.visible", timeout=5000)
        page.wait_for_timeout(1000)

        # Re-query button to ensure freshness
        btn = page.locator("#btn-add-expedition")
        btn.click() # Initialize second target

        # Set dialog handler BEFORE trigger
        page.on("dialog", lambda dialog: dialog.accept())

        # Force click simulate. Triple quotes for safety.
        page.evaluate("""document.getElementById("btn-simulate-mission").click()""")

        # Wait for simulation to start (Mission Control visible)
        page.wait_for_selector("#mission-control.visible", timeout=5000)

        # Inject an event via console
        print("Dispatching overwatch-alert event...")
        page.evaluate("""
            window.dispatchEvent(new CustomEvent("overwatch-alert", {
                detail: {
                    threat: {
                        category: "TEST_THREAT",
                        message: "Manual Trigger for Verification",
                        severity: "CRITICAL",
                        location: { lat: 17.0, lng: -88.0 },
                        radius: 10,
                        riskModifier: 50
                    },
                    action: "REROUTE_REQUIRED"
                }
            }));
        """)

        # Wait for log entry.
        # Check if logs are being populated.
        # Maybe I am looking for the wrong class?
        # app.js: div.className = `log-entry ${type}`; -> log-entry critical

        page.wait_for_selector(".log-entry", timeout=5000)
        # Take screenshot
        page.screenshot(path="verification/overwatch_alert.png")
        print("Verification successful")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        page.screenshot(path="verification/error.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        verify_tactical_alert(page)
        browser.close()
