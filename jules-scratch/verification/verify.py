from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(msg.text))
    page.goto("http://localhost:8080")
    page.fill('input[type="text"]', "sp00ks")
    page.fill('input[type="password"]', "Th3devilisn3ar@@*&")
    page.click('button[type="submit"]')
    page.screenshot(path="jules-scratch/verification/after-login.png")
    page.wait_for_selector('a[href="/connections"]')
    page.click('a[href="/connections"]')
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
