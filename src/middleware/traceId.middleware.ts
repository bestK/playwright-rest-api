import { Config, IMiddleware, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { v4 as uuidv4 } from 'uuid';

@Provide()
@Scope(ScopeEnum.Request)
export class TraceIdMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('trace')
  traceConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // Generate a unique traceId
      const traceId = ctx.query['traceId'] || uuidv4();
      // Set the traceId in the context
      ctx.traceId = traceId;
      // Optionally, set the traceId in response header
      ctx.set(this.traceConfig['headerName'], traceId);

      ctx.setAttr(this.traceConfig['headerName'], traceId);

      // Log the traceId if needed
      ctx.logger.info(`TraceId: ${traceId}`);

      await next();
    };
  }
}
