import { chromium } from '@playwright/test';

(async () => {
    console.log("Starting browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to login...");
    await page.goto('http://localhost:3001/login');
    await page.waitForTimeout(2000);

    // Click the DEV LOGIN button
    console.log("Clicking dev login button...");
    const devLoginBtn = page.locator('button:has-text("Quick Login (Dev Only)")');
    if (await devLoginBtn.isVisible()) {
        await devLoginBtn.click();
    } else {
        console.log("Dev login button not found!");
        await browser.close();
        return;
    }

    await page.waitForTimeout(3000);
    console.log("Checking session after login...");
    const currentURL = page.url();
    console.log("Current URL:", currentURL);

    const cookies = await context.cookies();
    console.log("Cookies after login:", cookies);

    console.log("Refreshing page...");
    await page.reload();
    await page.waitForTimeout(3000);

    const newURL = page.url();
    console.log("URL after refresh:", newURL);

    const cookiesAfterRefresh = await context.cookies();
    console.log("Cookies after refresh:", cookiesAfterRefresh);

    await browser.close();
    console.log("Done.");
})();
