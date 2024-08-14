import { ALL, Body, Controller, Inject, Post } from '@midwayjs/core';
import { Get } from '@midwayjs/core/dist/decorator';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { Executor } from '../interface';

@Controller('/api/v1/scheduler')
export class SchedulerController {
  @Inject()
  ctx: Context;

  @Inject()
  redisService: RedisService;

  @Post('/ping')
  async heartbeat(@Body(ALL) executor: Executor) {
    // 存储信息到 redis
    await this.redisService.set(
      `playwright::executor::${executor.name}`,
      JSON.stringify(executor),
      'EX',
      10
    );

    return 'pong';
  }

  /**
   * 返回执行器
   * @returns
   */
  @Get('/executor')
  async executor(): Promise<Executor[]> {
    const keys = await this.redisService.keys('playwright::executor::*');
    if (keys.length) {
      const executors = await this.redisService.mget(keys);
      return executors.map(executor => JSON.parse(executor));
    }
    return [];
  }

  /**
   * 返回执行器
   * @returns
   */
  @Get('/executor/view')
  async executorView() {
    const keys = await this.redisService.keys('playwright::executor::*');
    let executors = [];

    if (keys.length) {
      const executorStrings = await this.redisService.mget(keys);
      executors = executorStrings.map(executor => JSON.parse(executor));
    }

    // 统一渲染视图
    return await this.ctx.render('executors.html', { executors });
  }
}
