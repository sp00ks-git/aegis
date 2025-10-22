
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # 1. Navigate to the login page
            await page.goto("http://localhost:3000/login", timeout=90000) # Increased timeout

            # 2. Log in using placeholder locators
            await page.get_by_placeholder("Username").fill("sp00ks")
            await page.get_by_placeholder("Password").fill("Th3devilisn3ar@@*&")
            await page.get_by_role("button", name="Login").click()

            # 3. Wait for navigation to the connections page and verify
            await expect(page).to_have_url("http://localhost:3000/connections", timeout=30000)

            # 4. Navigate to the new "Threat Attempts" page
            await page.click('a[href="/threats"]')
            await expect(page).to_have_url("http://localhost:3000/threats", timeout=30000)

            # 5. Take a screenshot of the threats page
            await page.screenshot(path="jules-scratch/verification/threats-page.png")

            # 6. Navigate to the Map page
            await page.click('a[href="/map"]')
            await expect(page).to_have_url("http://localhost:3000/map", timeout=30000)

            # 7. Take a screenshot of the map page
            await page.screenshot(path="jules-scratch/verification/map-page.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Capture screenshot on error for debugging
            await page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
