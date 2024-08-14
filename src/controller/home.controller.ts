import { Controller, Get, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Get('/')
  async home() {
    await this.ctx.render('home.html', { user: 'Midwayjs 3.0' });
  }

  @Get('/test')
  async test() {
    return { success: true, message: 'Hello Midwayjs 3.0' };
  }
}
