// Define the structure of your JSON

import { JsonInput, Step } from 'json-to-playwright';

// Function to generate Playwright script
export default async function generatePlaywrightScript(
  data: JsonInput,
  options?: { actionsOnly: boolean }
): Promise<string> {
  let script = '';

  if (options?.actionsOnly) {
    script += importUtils();
    script += `const {chromium} = require('playwright');\n\n`;
    script += `module.exports = async function (context) {\n`;
    script += `    const { logger, traceId, ctx } = context;\n`;
  } else {
    script += `test.describe("${data.title}", () => {\n`;
    script += `   test("tests ${data.title}", async ({ page }) => {\n`;
  }

  script += generateSteps(data.steps);

  if (options?.actionsOnly == true) {
    script += `};\n`;
  } else {
    script += `  });\n`;
    script += `});\n`;
  }

  return script;
}

const generateSteps = (
  steps: Step[],
  type?:
    | 'before'
    | 'after'
    | 'setLaunchOptions'
    | 'launch'
    | 'pageClose'
    | 'browserClose'
): string => {
  let script = '';

  let has_options: boolean = false;

  steps.forEach(step => {
    if (step.type === 'before' && step.before) {
      script += generateSteps(step.before);
    } else if (step.type === 'setLaunchOptions') {
      script += createLaunchOptions(step);
      has_options = true;
    } else if (step.type === 'launch') {
      if (has_options) {
        script += `    const browser = await chromium.launch(options);\n`;
      } else {
        script += `    const browser = await chromium.launch();\n`;
      }
      script += `    ctx['browser'] = browser;\n`;
      script += `    const page = await browser.newPage();\n`;
    } else if (step.type === 'setViewport') {
      script += setViewport(step);
    } else if (step.type === 'navigate') {
      script += navigateToUrl(step);
    } else if (step.type === 'pageClose') {
      script += `    await page.close();\n`;
    } else if (step.type === 'browserClose') {
      script += `    await browser.close();\n`;
    } else {
      script += performAction(step);
    }

    if (step.assertedEvents) {
      step.assertedEvents.forEach(event => {
        if (event.type === 'navigation') {
          script += `    expect(page.url()).toBe('${event.url}');\n`;
        }
      });
    }

    if (type === 'after' && step.after) {
      script += generateSteps(step.after);
    }
  });

  return script;
};

const setViewport = (step: Step): string => {
  if (step.width !== undefined && step.height !== undefined) {
    return `    await page.setViewportSize({ width: ${step.width}, height: ${step.height} });\n`;
  } else {
    return `    // Missing viewport dimensions\n`;
  }
};

const navigateToUrl = (step: Step): string => {
  if (step.url) {
    return `    await page.goto("${step.url}");\n`;
  } else {
    return `    // Missing URL for navigation\n`;
  }
};

const createLaunchOptions = (step: Step): string => {
  return `    const options = ${JSON.stringify(
    JSON.parse(step?.value || '{}')
  )};\n`;
};

const performAction = (step: Step): string => {
  if (step.type === 'evaluate' && step.value) {
    return `    await page.evaluate(() => { ${step.value} });\n`;
  }

  if (step.type === 'code' && step.value) {
    if (step.returnName) {
      return `    const ${step.returnName} = ${step.value};\n`;
    }
    return `    ${step.value};\n`;
  }

  const action = getAction(step);
  const selector = chooseBestSelector(step.selectors);
  if (selector) {
    return `    await page.locator("${selector}").${action};\n`;
  } else {
    return handleSpecialActions(step);
  }
};

const getAction = (step: Step): string => {
  switch (step.type) {
    case 'click':
      return 'click()';
    case 'fill':
      return `fill('${step.value}')`;
    case 'check':
      return 'check()';
    case 'uncheck':
      return 'uncheck()';
    case 'select':
      return `selectOption('${step.value}')`;
    case 'hover':
      return 'hover()';
    case 'dblclick':
      return 'dblclick()';
    case 'press':
      return `press('${step.value}')`;
    case 'isVisible':
      return `isVisible()`;
    case 'textContent':
      return `textContent()`;
    case 'change':
      return `type('${step.value}')`;
    default:
      return `// Unsupported action type: ${step.type}`;
  }
};

const handleSpecialActions = (step: Step): string => {
  switch (step.type) {
    case 'executeScript':
      return `    await page.evaluate(() => { ${step.value} });\n`;
    case 'request':
      const headers = step.request?.headers
        ? JSON.stringify(step.request.headers)
        : '{}';
      const data = step.request?.data
        ? JSON.stringify(step.request.data)
        : 'null';
      return `    const response = await request.${step.request?.method.toLowerCase()}("${
        step.request?.url
      }", { headers: ${headers}, data: ${data} });\n`;
    case 'isVisible':
      const selector = chooseBestSelector(step.selectors);
      return selector
        ? `    const isVisible = await page.locator("${selector}").isVisible();\n`
        : `    // Missing selector for visibility check\n`;
    case 'textContent':
      const textSelector = chooseBestSelector(step.selectors);
      return textSelector
        ? `    const textContent = await page.locator("${textSelector}").textContent();\n`
        : `    // Missing selector for text content\n`;
    case 'sleep':
      return `    await sleep(${step.value});\n`;
    default:
      return `    // handleSpecialActions Unsupported special action type: ${step.type}\n`;
  }
};

const chooseBestSelector = (
  selectors: string[][] | undefined
): string | undefined => {
  if (!selectors) return undefined;
  return selectors
    .map(s => s)
    .flat()
    .find(
      sel =>
        !sel.startsWith('xpath') &&
        !sel.startsWith('pierce') &&
        !sel.startsWith('aria')
    );
};

const importUtils = (): string => {
  return `const { sleep, postJson, postForm, getJson, uploadFile, downloadFile } = require('../../../../common/utils');\n`;
};
