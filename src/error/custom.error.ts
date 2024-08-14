import { MidwayError } from '@midwayjs/core';

export class CustomEmptyDataError extends MidwayError {
  constructor(err?: Error) {
    super('Custom error', {
      cause: err,
    });
    if (err?.stack) {
      this.stack = err.stack;
    }
  }
}
