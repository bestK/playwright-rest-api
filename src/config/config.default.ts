import { MidwayConfig } from '@midwayjs/core';
import { config } from './load.config';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1722822582273_1914',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: {
      '.nj': 'nunjucks',
    },
  },

  bodyParser: {
    onerror: (err, ctx) => {
      ctx.app.emit('error', err, ctx);
    },
  },

  trace: {
    enable: true,
    headerName: 'X-Trace-Id',
  },

  redis: {
    client: {
      port: config.redis.port,
      host: config.redis.host,
      password: config.redis.password,
      db: config.redis.db,
    },
  },

  bull: {
    defaultQueueOptions: {
      redis: {
        port: config.redis.port,
        host: config.redis.host,
        password: config.redis.password,
        db: config.redis.db,
      },
    },
  },
} as MidwayConfig;
