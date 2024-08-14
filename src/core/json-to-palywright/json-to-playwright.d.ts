declare module 'json-to-playwright' {
  export interface Step {
    type: string;
    width?: number;
    height?: number;
    url?: string;
    selectors?: string[][];
    value?: string;
    assertedEvents?: { type: string; url: string; title: string }[];
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
    offsetX?: number;
    offsetY?: number;
    target?: string;
    before?: Step[];
    after?: Step[];
    request?: Request;
    returnName?: string;
  }

  export interface Request {
    method: string;

    url: string;

    headers?: Record<string, string>;

    data?: any;
  }

  export interface JsonInput {
    title: string;
    steps: Step[];
  }

  export default function generatePlaywrightScript(
    data: JsonInput,
    options?: { actionsOnly: boolean }
  ): string;

  export const setViewport: (step: Step) => string;

  export const navigateToUrl: (step: Step) => string;

  export const performAction: (step: Step) => string;

  export const chooseBestSelector: (
    selectors: string[][] | undefined
  ) => string | undefined;
}
