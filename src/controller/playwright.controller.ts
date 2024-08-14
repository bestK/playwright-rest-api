import { ALL, Body, Controller, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { JsonInput } from '../core/json-to-palywright/interface';

import { PlaywrightModifyRequest, PlaywrightRunResponse } from '../interface';
import { PlaywrightServiceImpl } from '../service/impl/PlaywrightServiceImpl';

@Controller('/api/v1/playwright')
export class PlaywrghtController {
  @Inject()
  ctx: Context;

  @Inject()
  logger;

  @Inject()
  playwrightService: PlaywrightServiceImpl;

  @Post('/run')
  async runScript(
    @Query('scriptId') scriptId: string,
    @Query('version') version: string = 'V1',
    @Body(ALL) params: any
  ): Promise<PlaywrightRunResponse<Object>> {
    return await this.playwrightService.runScript(scriptId, version, params);
  }

  @Post('/modify')
  async modifyScript(@Body(ALL) reqeust: PlaywrightModifyRequest) {
    return await this.playwrightService.modifyScript(reqeust);
  }

  @Post('/generate')
  async generateScript(@Body(ALL) request: JsonInput) {
    this.ctx.type = 'json';
    const script = await this.playwrightService.generateScript(request);
    this.logger.info('Generated script\n', script);
    return script;
  }
}
