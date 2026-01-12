from playwright.sync_api import sync_playwright

def verify_toast():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8080")

        # Click Intro
        page.click("#introduction")
        page.wait_for_timeout(500)

        # Click Simulate with no targets to trigger Toast
        # The Simulate button is hidden unless HUD is visible.
        # But HUD only shows if items > 0?
        # Let's check logic:
        # updateExpeditionUI handles visibility.
        # If list length > 0, HUD visible.
        # But Simulate btn is IN the HUD.
        # So we can't click Simulate if HUD is hidden.
        # But wait, app.js logic says:
        # btnSimulateMission.addEventListener('click', ...) checks if list.length < 2.

        # If list is empty, HUD is hidden.
        # So we must add 1 target, then click Simulate.

        # 1. Click a marker to open panel
        # Wait for markers
        page.wait_for_selector(".leaflet-marker-icon")
        markers = page.locator(".leaflet-marker-icon")
        markers.first.click()

        # 2. Add to Expedition
        page.click("#btn-add-expedition")

        # 3. Now HUD should be visible
        page.wait_for_selector("#expedition-hud.visible")

        # 4. Click Simulate (1 target < 2)
        page.click("#btn-simulate-mission")

        # Check if Toast appears
        # Toast might take animation time
        page.wait_for_selector(".toast-msg.critical", state="visible", timeout=5000)

        toast = page.locator(".toast-msg.critical")

        if toast.is_visible():
            print("Toast verified: Visible")
            text = toast.inner_text()
            if "Minimum 2 targets required" in text:
                print("Toast verified: Correct Text")
            else:
                print(f"Toast Failure: Text mismatch '{text}'")
                exit(1)
        else:
             print("Toast Failure: Not visible")
             exit(1)

        browser.close()

if __name__ == "__main__":
    verify_toast()
