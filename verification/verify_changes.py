from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080/index.html")

        # Click the introduction to start
        page.click("#introduction")

        # Wait for the map to load (leaflet-container usually indicates this)
        page.wait_for_selector(".leaflet-container")

        is_overwatch_loaded = page.evaluate("typeof window.Overwatch !== 'undefined'")
        print(f"Overwatch Loaded: {is_overwatch_loaded}")

        is_telemetry_loaded = page.evaluate("typeof window.TelemetryStream !== 'undefined'")
        print(f"TelemetryStream Loaded: {is_telemetry_loaded}")

        # Verify Constellation Canvas has aria-label
        canvas_label = page.get_attribute("#constellation-canvas", "aria-label")
        print(f"Canvas Label: {canvas_label}")

        # Verify Log Container has aria-live
        log_live = page.get_attribute("#mc-log-container", "aria-live")
        print(f"Log Container Live: {log_live}")

        # Take a screenshot
        page.screenshot(path="verification/app_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_app()
