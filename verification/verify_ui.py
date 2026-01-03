
from playwright.sync_api import sync_playwright
import os

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        page.wait_for_selector("#introduction")
        page.screenshot(path="verification/1_intro.png")
        print("Captured 1_intro.png")

        page.click("#introduction")

        page.wait_for_selector("#tactical-toggle")
        page.wait_for_timeout(2000)

        page.screenshot(path="verification/2_map_view.png")
        print("Captured 2_map_view.png")

        page.click("#tactical-toggle")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/3_tactical_mode.png")
        print("Captured 3_tactical_mode.png")

        page.click("#tactical-toggle")

        page.wait_for_selector(".leaflet-marker-icon")

        markers = page.locator(".leaflet-marker-icon")
        if markers.count() > 0:
            markers.first.click()
            print("Clicked marker")

            page.wait_for_selector("#info-panel.visible")
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/4_info_panel.png")
            print("Captured 4_info_panel.png")

            page.click("#btn-add-expedition")

            page.wait_for_selector("#expedition-hud.visible")
            page.wait_for_timeout(500)
            page.screenshot(path="verification/5_hud.png")
            print("Captured 5_hud.png")

        browser.close()

if __name__ == "__main__":
    verify_ui()
