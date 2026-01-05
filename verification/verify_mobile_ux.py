from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Simulate Pixel 5
    context = browser.new_context(viewport={'width': 393, 'height': 851}, user_agent='Mozilla/5.0 (Linux; Android 11; Pixel 5 Build/RQ3A.210605.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.131 Mobile Safari/537.36')
    page = context.new_page()

    # Load local file
    import os
    cwd = os.getcwd()
    page.goto(f"file://{cwd}/index.html")

    # Wait for map to load (simulate interaction to start)
    page.click('#introduction')
    page.wait_for_timeout(2000)

    # Click a marker (simulated by finding a leaflet marker or just assuming one is at a position)
    # Since markers are canvas/divs, we can click center of screen?
    # Better: Click the first marker in the DOM.
    # Leaflet markers have class 'leaflet-marker-icon'
    page.wait_for_selector('.leaflet-marker-icon')
    markers = page.locator('.leaflet-marker-icon').all()
    if markers:
        markers[0].click()
        page.wait_for_timeout(1000) # Wait for panel animation

        # Verify Info Panel is visible
        panel = page.locator('#info-panel')
        if panel.is_visible():
            print("Info Panel is visible.")

            # Verify Focus Management: Panel should be focused (or active element inside)
            # We can check document.activeElement
            active_id = page.evaluate("document.activeElement.id")
            print(f"Active Element ID: {active_id}")

            # Verify Image URL (Performance check)
            img_src = page.locator('#panel-image').get_attribute('src')
            print(f"Image Source: {img_src}")
            if "&w=400" in img_src:
                print("SUCCESS: Mobile image width requested.")
            else:
                print(f"FAILURE: Image width not optimized: {img_src}")

            # Take screenshot of open panel
            page.screenshot(path="verification/mobile_panel_open.png")

            # Test Drag to Close
            # Simulate touch drag
            # Get panel bounding box
            box = panel.bounding_box()
            if box:
                start_y = box['y'] + 20
                end_y = start_y + 200 # Drag down 200px

                page.mouse.move(box['x'] + box['width']/2, start_y)
                page.mouse.down()
                page.mouse.move(box['x'] + box['width']/2, end_y, steps=10)
                page.mouse.up()

                page.wait_for_timeout(1000)

                if not panel.is_visible(): # Or opacity 0 or transformed away
                     # Check class 'visible' removed
                     classes = panel.get_attribute('class')
                     if 'visible' not in classes:
                         print("SUCCESS: Panel closed via drag.")
                     else:
                         print("FAILURE: Panel still visible.")
                else:
                    # Check transform if it snapped back or closed
                    print("Checking panel visibility state...")
                    classes = panel.get_attribute('class')
                    if 'visible' not in classes:
                         print("SUCCESS: Panel closed via drag.")
                    else:
                         print("FAILURE: Panel failed to close.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
