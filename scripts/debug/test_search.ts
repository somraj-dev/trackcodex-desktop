import { chromium } from '@playwright/test';
(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
        await page.goto('http://localhost:3001/login');
        await page.waitForTimeout(1000);
        const devLoginBtn = page.locator('button:has-text("Quick Login (Dev Only)")');
        if (await devLoginBtn.isVisible()) {
            await devLoginBtn.click();
            await page.waitForTimeout(2000);
        }

        const res1 = await page.evaluate(async () => {
            const res = await fetch('/api/v1/search?q=DeV', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session_id')}`
                }
            });
            return res.json();
        });
        console.log("Search results for 'DeV':", res1.results?.length);

        const res2 = await page.evaluate(async () => {
            const res = await fetch('/api/v1/search?q=dev', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session_id')}`
                }
            });
            return res.json();
        });
        console.log("Search results for 'dev':", res2.results?.length);
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
