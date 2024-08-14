import { JsonInput } from '../core/json-to-palywright/interface';
import {
  PlaywrightModifyRequest,
  PlaywrightModifyResponse,
  PlaywrightRunResponse,
  PlaywrightStorageState,
} from '../interface';

export interface IPlaywrightService<T> {
  /**
   * 生成脚本
   * @param reqeust
   */
  generateScript(reqeust: JsonInput): any;
  /**
   * 发版脚本
   * @param reqeust
   */
  modifyScript<T>(
    reqeust: PlaywrightModifyRequest
  ): Promise<PlaywrightModifyResponse>;
  /**
   * 执行脚本
   * @param scriptId
   * @param version
   * @param params
   */
  runScript(
    scriptId: string,
    version: string,
    params: any
  ): Promise<PlaywrightRunResponse<T>>;

  /**
   * 保存登录信息
   * @param userId
   * @param storageState
   */
  saveStorageState(
    userId: string,
    storageState: PlaywrightStorageState
  ): Promise<void>;

  /**
   * 获取登录信息
   * @param userId
   */
  getStorageState(userId: string): Promise<PlaywrightStorageState>;
}
