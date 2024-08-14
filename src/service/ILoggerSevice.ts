import { ILogger } from '@midwayjs/core';

export interface ILoggerService {
  /**
   * 根据scriptId和version获取logger
   * @param scriptId
   * @param version
   */
  getLogger(scriptId, version): ILogger;
}
