// 读取 .env 配置
import * as dotenv from 'dotenv';
import { IConfig } from '../interface';

// load .env file in process.cwd
dotenv.config();
dotenv.config();

export const config: IConfig = {
  redis: {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0'),
  },

  executor: {
    name: process.env.EXECUTOR_NAME || 'playwright',
    ip: process.env.EXECUTOR_IP || '',
    lead: process.env.EXECUTOR_LEAD || '',
  },
  ddddOcr: {
    endpoint: process.env.DDDD_OCR_ENDPOINT,
  },
};
