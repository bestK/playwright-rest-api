// src/job/sync.job.ts
import { Context, FORMAT, Inject, makeHttpRequest } from '@midwayjs/core';
import { IJob, Job } from '@midwayjs/cron';
import { config } from '../config/load.config';
const os = require('os');
@Job('ExecutorPingJob', {
  cronTime: FORMAT.CRONTAB.EVERY_PER_10_SECOND,
  start: true,
  runOnInit: true,
})
export class ExecutorPingJob implements IJob {
  @Inject()
  ctx: Context;
  async onTick() {
    const { name, ip, lead } = config.executor;

    // 获取机器的基本信息
    const cpu = os.cpus(); // 获取 CPU 信息
    const totalMemory = os.totalmem(); // 获取总内存
    const freeMemory = os.freemem(); // 获取空闲内存
    const platform = os.platform(); // 获取操作系统平台
    const arch = os.arch(); // 获取操作系统架构
    const uptime = os.uptime(); // 获取系统运行时间

    const response = await makeHttpRequest(
      `http://${lead}/api/v1/scheduler/ping`,
      {
        method: 'POST',
        data: {
          name: name,
          ip: ip,
          cpu: cpu,
          totalMemory: totalMemory,
          freeMemory: freeMemory,
          platform: platform,
          arch: arch,
          uptime: uptime,
        },
        dataType: 'json',
        contentType: 'json',
      }
    );
    this.ctx.logger.info('ping executor', response.data);
  }
}
