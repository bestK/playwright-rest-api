import { Context, Inject, Provide } from '@midwayjs/core';
import { loggers } from '@midwayjs/logger';
import * as path from 'path';
import { ILoggerService } from '../ILoggerSevice';

@Provide()
export class LoggerServiceImpl implements ILoggerService {
  @Inject()
  ctx: Context;

  /**
   * 获取logger
   * @param scriptId
   * @param version
   * @returns
   */
  getLogger(scriptId, version) {
    const loggerName = `${scriptId}${version}Logger`;
    const logsPath = path.join(process.cwd(), 'logs');
    const logger =
      loggers.get(loggerName) ||
      loggers.createLogger(loggerName, {
        format: info => this.formatLog(info, scriptId, version, false),
        transports: {
          file: {
            fileLogName: `${scriptId}${version}.log`,
            auditFileDir: path.join(logsPath, '.audit'),
            dir: logsPath,
          },
          console: {
            level: 'info',
            format: info => this.formatLog(info, scriptId, version),
          },
        },
      });

    return logger;
  }

  colorizeLevel(level, log) {
    const levelColors = {
      info: '\x1b[32m', // 绿色
      warn: '\x1b[33m', // 黄色
      error: '\x1b[31m', // 红色
      debug: '\x1b[34m', // 蓝色
    };
    const resetColor = '\x1b[0m'; // 重置颜色
    return `${levelColors[level] || ''}${log}${resetColor}`;
  }

  formatLog(info, scriptId, version, colorize = true) {
    const traceId = this.ctx['traceId'] || null;
    const log = `${info.timestamp} ${info.level.toUpperCase()} ${
      info.pid
    } ${traceId} ${scriptId}${version} ${info.message}`;

    return colorize ? this.colorizeLevel(info.level, log) : log;
  }
}
