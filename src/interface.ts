import { ApiProperty } from '@midwayjs/swagger';

/**
 * @description script modify parameters
 */
export class PlaywrightModifyRequest {
  // scriptId
  @ApiProperty({
    example: 'getBaiduTitle',
    description: '脚本ID',
  })
  scriptId: string;
  @ApiProperty({ example: '', description: '脚本内容 base64编码' })
  scriptContent: string;
  @ApiProperty({ example: 'v1', description: '版本号，相同版本号会报错' })
  version: string;
}

/**
 * @description script modify response
 */
export class PlaywrightModifyResponse {
  @ApiProperty({
    example: 'getBaiduTitle',
    description: '脚本ID',
  })
  scriptId: string;

  @ApiProperty({ example: 'v1', description: '版本号，相同版本号会报错' })
  version: string;
}

/**
 * @description script run response
 */
export class PlaywrightRunResponse<T> {
  @ApiProperty({
    example: 'getBaiduTitle',
    description: '脚本ID',
  })
  scriptId: string;

  @ApiProperty({ description: '脚本执行返回数据' })
  result: T;
}

export interface IConfig {
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
  };
  executor: {
    name: string;
    ip: string;
    lead: string;
  };
  ddddOcr: {
    endpoint: string;
  };
}

export interface Executor {
  name: string;
  ip: string;
  status: string;
  cpu: string;
  totalMemory: string;
  freeMemory: string;
  platform: string;
  arch: string;
  uptime: string;
}

export interface PlaywrightStorageState {
  cookies: Array<{
    name: string;

    value: string;

    domain: string;

    path: string;

    /**
     * Unix time in seconds.
     */
    expires: number;

    httpOnly: boolean;

    secure: boolean;

    sameSite: 'Strict' | 'Lax' | 'None';
  }>;

  origins: Array<{
    origin: string;

    localStorage: Array<{
      name: string;

      value: string;
    }>;
  }>;
}
