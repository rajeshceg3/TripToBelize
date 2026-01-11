from playwright.sync_api import sync_playwright, expect
import time
import re

def verify_mobile_overlap_fix(page):
    """
    Verifies that the Info Panel sits ON TOP of the Expedition HUD on mobile.
    """
    print("Navigating to app...")
    page.goto("http://localhost:8080")

    # 1. Dismiss Intro
    intro = page.locator("#introduction")
    if intro.is_visible():
        print("Dismissing intro...")
        intro.click()
        expect(intro).to_have_class(re.compile(r"hidden"))

    # 2. Wait for map/markers
    page.wait_for_selector(".leaflet-marker-icon")
    print("Map loaded.")

    # 3. Simulate Mobile Viewport
    page.set_viewport_size({"width": 375, "height": 667})
    print("Viewport set to iPhone SE size.")

    # 4. Click a marker to open Info Panel
    markers = page.locator(".leaflet-marker-icon:not(.dimmed)")
    markers.first.click()
    print("Marker clicked.")

    # 5. Wait for Info Panel
    info_panel = page.locator("#info-panel")
    expect(info_panel).to_have_class(re.compile(r"visible"))
    print("Info Panel visible.")

    # 6. Add to Expedition (Triggers HUD)
    add_btn = page.locator("#btn-add-expedition")
    add_btn.click()
    print("Added to expedition.")

    # 7. Wait for HUD to appear
    hud = page.locator("#expedition-hud")
    expect(hud).to_have_class(re.compile(r"visible"))
    print("HUD visible.")

    # 8. Take Screenshot of Overlap
    print("Taking screenshot of overlap state...")
    # We expect Info Panel to be fully visible and HUD to be behind it (or below it, but they overlap at the bottom on mobile)
    page.screenshot(path="verification/mobile_overlap.png")

    # 9. Verify Interaction
    close_btn = page.locator("#close-panel")
    print("Attempting to click Close Panel button...")
    close_btn.click(timeout=2000)
    print("Click successful! Panel was not obscured.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_mobile_overlap_fix(page)
            print("Verification Complete.")
        except Exception as e:
            print(f"Verification Failed: {e}")
        finally:
            browser.close()
