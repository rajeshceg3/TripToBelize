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
        page.click("#btn-simulate-mission")

        # Check if Toast appears
        toast = page.wait_for_selector(".toast-msg.critical", state="visible")

        if toast:
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
