import { Catch, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  @Config('trace')
  traceConfig;

  async catch(err: Error, ctx: Context) {
    ctx.logger.error(err);
    // 所有的未分类错误会到这里
    const traceId = ctx.getAttr(this.traceConfig['headerName']) || null;
    return {
      success: false,
      message: err.message,
      data: null,
      traceId: traceId,
    };
  }
}
