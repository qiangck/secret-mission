import Store from '../store';
import { APPNAME, SESSIONNAME } from '../types';
import { getWindow, getMemoryStore } from '../utils/window';
import { resolveHtmlPath, randomString } from '../utils/util';
import { session } from 'electron';

const resolvePath = resolveHtmlPath('index.html');

export type VerificationStatusType = {
  status: boolean;
  userid?: number;
  username?: string;
  sessionid?: string;
};

export default class Session extends Store {
  constructor() {
    super();
  }
  // 设置session
  async setSessionid(username: string): Promise<string> {
    const memoryStore = getMemoryStore();

    const sessionid = randomString(32);

    const userid = await this.getUsernameCheckUserid(username);

    await memoryStore?.set(userid, {
      userid,
      username,
      sessionid,
    });

    return sessionid;
  }
  // 清除session
  async clearSessionid() {
    const memoryStore = getMemoryStore();

    memoryStore?.clear();
  }
  // 获取缓存session
  async getMemorySession(): Promise<any[]> {
    const memoryStore = getMemoryStore();

    const sessionids: any[] = (await memoryStore?.all()) || [];

    return sessionids;
  }
  // 验证session
  async verificationSessionid(
    sessionid: string
  ): Promise<VerificationStatusType> {
    const sessionids = await this.getMemorySession();

    const userItem: any = sessionids.find(
      (item: any) => item.sessionid === sessionid
    );

    return userItem
      ? {
          status: true,
          ...userItem,
        }
      : { status: false };
  }
  // 用户名换id
  getUsernameCheckUserid(username: string): Promise<string> {
    const USERSTORENAME = `${APPNAME}-user`;

    const users: any = this.$arraySearch(USERSTORENAME, [
      { key: 'username', value: username, include: false },
    ]);

    const userid = users.length ? users[0].id : -1;

    return userid;
  }
}
