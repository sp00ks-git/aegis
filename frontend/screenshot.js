const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:8080');
  await page.fill('input[type="text"]', 'sp00ks');
  await page.fill('input[type="password"]', 'Th3devilisn3ar@@*&');
  await page.click('button[type="submit"]');
  await page.waitForSelector('a[href="/connections"]');
  await page.click('a[href="/connections"]');
  await page.screenshot({ path: 'screenshot-connections.png' });
  await browser.close();
})();
