import * as bull from '@midwayjs/bull';
import { App, Configuration, Inject } from '@midwayjs/core';
import * as cron from '@midwayjs/cron';
import * as info from '@midwayjs/info';
import * as koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as validate from '@midwayjs/validate';
import * as view from '@midwayjs/view-nunjucks';
import { join } from 'path';
import { CustomErrorFilter } from './filter/custom.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { ResponseMiddleware } from './middleware/response.middleware';
import { TraceIdMiddleware } from './middleware/traceId.middleware';
@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    view,
    swagger,
    bull,
    redis,
    cron,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App()
  app: koa.Application;

  @Inject()
  bullFramework: bull.Framework;

  async onReady() {
    // add middleware
    this.app.useMiddleware([TraceIdMiddleware, ResponseMiddleware]);
    // add filter
    this.app.useFilter([CustomErrorFilter, DefaultErrorFilter]);
    // // 获取 Processor 相关的队列
    // const testQueue = this.bullFramework.getQueue('executorPing');
    // // 立即执行这个任务
    // await testQueue?.runJob({}, { delay: 1000 });
  }
}
