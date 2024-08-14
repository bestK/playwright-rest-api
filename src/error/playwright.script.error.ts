import { MidwayError } from '@midwayjs/core';

export class PlaywrightScriptError extends MidwayError {
  constructor(err?: Error, scriptId: string = '', version: string = '') {
    super(`The script ${scriptId}${version} has error: ${err.message}`, {
      cause: err,
    });
    if (err?.stack) {
      this.stack = err.stack;
    }
  }
}
