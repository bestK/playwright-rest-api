import { Catch, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CustomEmptyDataError } from '../error/custom.error';

@Catch(CustomEmptyDataError)
export class CustomErrorFilter {
  @Config('trace')
  traceConfig;

  async catch(err: CustomEmptyDataError, ctx: Context) {
    ctx.logger.error(err);
    const traceId = ctx.getAttr(this.traceConfig['headerName']);
    return `<html><body><h1>custom >  data is empty</h1>traceId: ${traceId}</body></html>`;
  }
}
