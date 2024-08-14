import { chromium, expect, test } from '@playwright/test';

test.describe('Devtools Protocol', () => {
  test('tests Devtools Protocol', async () => {
    const browser = await chromium.connectOverCDP('http://192.168.0.125:9223');

    const defaultContext = browser.contexts()[0];
    const page1 = await browser.newPage();
    await page1.evaluate(() => console.log('Hello from DevTools Protocol!'));
    await page1.setViewportSize({ width: 935, height: 989 });
    await page1.goto('https://www.baidu.com/');
    expect(page1.url()).toBe('https://www.baidu.com/');
    await page1.locator('#kw').fill('abc@example.com');
    await page1.evaluate(() => console.log('Hello from DevTools Protocol!'));
    await page1.evaluate(() => alert('Hello from DevTools Protocol!'));
    await sleep(3000);

    const state = await defaultContext.storageState();
  });
});

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
