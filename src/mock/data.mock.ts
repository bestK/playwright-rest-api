import {
  App,
  IMidwayApplication,
  Inject,
  ISimulation,
  MidwayMockService,
  Mock,
} from '@midwayjs/core';

@Mock()
export class WeatherDataMock implements ISimulation {
  @App()
  app: IMidwayApplication;

  @Inject()
  mockService: MidwayMockService;

  async setup(): Promise<void> {}

  enableCondition(): boolean | Promise<boolean> {
    // 模拟类启用的条件
    return ['local', 'test', 'unittest'].includes(this.app.getEnv());
  }
}
