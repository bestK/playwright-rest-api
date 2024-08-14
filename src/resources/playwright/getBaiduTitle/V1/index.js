const {
  sleep,
  postJson,
  postForm,
  getJson,
  uploadFile,
  downloadFile,
} = require('../../../../common/utils');
const { chromium } = require('playwright');

module.exports = async function (params, context) {
  const { logger, traceId, ctx } = context;
  const options = {
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  };

  const browser = await chromium.launch(options);
  ctx.browser = browser;
  const page = await browser.newPage();
  await page.setViewportSize({ width: 935, height: 989 });
  await page.goto('https://baidu.com');
  await sleep(3000);
  const { keyword } = params;
  await page.locator('#kw').fill(keyword);
  await sleep(3000);
  await page.evaluate(() => {
    alert('hello world');
  });
  logger.info('--------');
  const baiduResponse = await getJson('https://postman-echo.com/get?test=123');
  // throw Error(1);

  const title = await page.title();

  await page.close();

  await browser.close();

  logger.info(baiduResponse);

  return title;
};
