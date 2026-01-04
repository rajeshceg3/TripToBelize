from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Set large viewport
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        cwd = os.getcwd()
        page.goto(f'file://{cwd}/index.html')

        page.locator('#introduction').click()
        page.wait_for_timeout(1000)

        # 1. Blue Hole (Should be visible)
        page.get_by_label("Great Blue Hole").click(force=True)
        page.wait_for_timeout(1000)
        page.screenshot(path='verification/1_blue_hole_panel.png')

        page.get_by_text("Initialize Target").click()

        # 2. Programmatic click for Xunantunich to avoid viewport issues
        # Find the element handle and dispatch click
        handle = page.get_by_label("Xunantunich")
        handle.dispatch_event('click')
        page.wait_for_timeout(1000)

        # 3. Race condition check
        # Dispatch clicks rapidly
        page.get_by_label("Cockscomb Basin").dispatch_event('click')
        page.get_by_label("ATM Cave").dispatch_event('click')

        page.wait_for_timeout(1500)
        page.screenshot(path='verification/2_race_condition_check.png')

        page.get_by_text("Initialize Target").click()

        # 4. Briefing
        page.locator('#btn-generate-brief').click()
        page.wait_for_timeout(500)
        page.screenshot(path='verification/3_briefing_modal.png')

        browser.close()

if __name__ == "__main__":
    run()
