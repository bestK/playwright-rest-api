import { Context, Inject, Provide } from '@midwayjs/core';
import { BadRequestError } from '@midwayjs/core/dist/error/http';

import generatePlaywrightScript from '../../core/json-to-palywright';
import { JsonInput } from '../../core/json-to-palywright/interface';
import { PlaywrightScriptError } from '../../error/playwright.script.error';
import {
  PlaywrightModifyRequest,
  PlaywrightModifyResponse,
  PlaywrightRunResponse,
  PlaywrightStorageState,
} from '../../interface';
import { IPlaywrightService } from '../IPlaywrightService';
import { LoggerServiceImpl } from './LoggerServiceImpl';
import path = require('path');
import fs = require('fs');

import { RedisService } from '@midwayjs/redis';
import constant from '../../constant';

@Provide()
export class PlaywrightServiceImpl implements IPlaywrightService<Object> {
  @Inject()
  loggerService: LoggerServiceImpl;

  @Inject()
  ctx: Context;

  @Inject()
  redisService: RedisService;

  generateScript(reqeust: JsonInput) {
    return generatePlaywrightScript(reqeust, { actionsOnly: true });
  }

  async modifyScript(
    reqeust: PlaywrightModifyRequest
  ): Promise<PlaywrightModifyResponse> {
    const { scriptId, scriptContent, version } = reqeust;
    const scriptPath = await this.getScriptPath(scriptId, version);
    // 如果文件存在抛出版本重复异常
    if (fs.existsSync(scriptPath)) {
      throw new BadRequestError('Version already exists');
    }

    // base64 解码
    const scriptContentBuffer = Buffer.from(scriptContent, 'base64');
    // 判断 scriptPath 是否存在不存在先创建
    const dirname = path.dirname(scriptPath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(scriptPath, scriptContentBuffer.toString());
    return {
      scriptId: scriptId,
      version: version,
    };
  }

  async runScript<T>(
    scriptId: string,
    version: string,
    params: any
  ): Promise<PlaywrightRunResponse<T>> {
    const script = await this.getScript(scriptId, version);
    const logger = this.loggerService.getLogger(scriptId, version);
    try {
      return {
        scriptId: scriptId,
        result: await script(params, {
          logger: logger,
          traceId: this.ctx['traceId'],
          ctx: this.ctx,
          playwrightService: this,
        }),
      };
    } catch (error) {
      const browser = this.ctx['browser'];
      if (browser && browser.isConnected()) {
        logger.error('Close browser', {
          traceId: this.ctx['traceId'],
          error: error,
        });
        await browser.close();
      }

      throw new PlaywrightScriptError(error, scriptId, version);
    }
  }

  async saveStorageState(
    userId: string,
    storageState: PlaywrightStorageState
  ): Promise<void> {
    await this.redisService.set(
      `${constant.RedisCacheKey.StorageState}::${userId}`,
      JSON.stringify(storageState)
    );
    return;
  }

  async getStorageState(userId: string): Promise<PlaywrightStorageState> {
    const storageStateStr = await this.redisService.get(
      `${constant.RedisCacheKey.StorageState}::${userId}`
    );

    if (!storageStateStr) {
      return null;
    }

    return JSON.parse(storageStateStr);
  }

  async getScript(scriptId: string, version: string) {
    const scriptPath = await this.getScriptPath(scriptId, version);

    // 检查文件是否存在
    if (!fs.existsSync(scriptPath)) {
      throw new BadRequestError('Script not found');
    }

    const script = require(scriptPath);

    // 确保返回的脚本是一个函数
    if (typeof script !== 'function') {
      throw new BadRequestError('Invalid script');
    }

    // return  script function
    return script;
  }

  async getScriptPath(scriptId: string, version: string) {
    return path.join(
      __dirname,
      '../../resources/playwright',
      `${scriptId}/${version}/index.js`
    );
  }
}
