
from playwright.sync_api import sync_playwright, expect
import time

def verify_bugs(page):
    print("Navigating to app...")
    page.goto("http://localhost:8080")

    # 1. Dismiss Intro Splash
    print("Dismissing intro...")
    intro = page.locator("#introduction")
    intro.click()
    # Wait for map to initialize (map container should not be empty, but hard to check content)
    # Check if a marker exists
    print("Waiting for markers...")
    page.wait_for_selector(".leaflet-marker-icon", state="visible", timeout=10000)

    # 2. Select a location to add to expedition
    print("Selecting location...")
    marker = page.locator(".leaflet-marker-icon").first
    marker.click()

    # Wait for info panel
    print("Waiting for info panel...")
    add_btn = page.locator("#btn-add-expedition")
    expect(add_btn).to_be_visible()

    # Add to expedition
    add_btn.click()

    # Wait for HUD
    print("Waiting for HUD...")
    hud = page.locator("#expedition-hud")
    expect(hud).to_be_visible()

    # 3. Check Simulate Button Visibility (Contrast)
    print("Checking simulate button...")
    sim_btn = page.locator(".simulate-btn")
    expect(sim_btn).to_be_visible()

    # Take screenshot of the HUD with the button
    page.screenshot(path="verification/hud_contrast.png")
    print("Screenshot 1 taken.")

    # 4. Trigger "Simulate" with only 1 item (Expect Alert)
    print("Triggering simulation (expecting alert)...")

    # Setup dialog handler
    dialog_message = []
    page.on("dialog", lambda dialog: (
        dialog_message.append(dialog.message),
        dialog.accept()
    ))

    sim_btn.click()

    # Wait a moment for dialog
    time.sleep(1)

    if dialog_message:
        print(f"Alert received: {dialog_message[0]}")
        if "MISSION ABORTED" in dialog_message[0]:
            print("SUCCESS: Mission Aborted alert verified.")
        else:
            print(f"FAILURE: Unexpected alert message: {dialog_message[0]}")
    else:
        print("FAILURE: No alert received.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_bugs(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
