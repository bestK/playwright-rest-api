import { Config, IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class ResponseMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('trace')
  traceConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑
      ctx.logger.info(
        `Report in "src/middleware/response.middleware.ts", rt = ${
          Date.now() - startTime
        }ms`
      );
      // 返回给上一个中间件的结果
      const traceId = ctx.getAttr(this.traceConfig['headerName']) || null;

      if (ctx.type.includes('html')) {
        return result + `\n<!-- traceId:${traceId} -->`;
      }

      return {
        success: true,
        data: result,
        message: 'OK',
        traceId: traceId,
      };
    };
  }
}
