import MD5 from 'md5';
import Store from '../store';
import { APPNAME } from '../types';
import { randomString } from '../utils/util';
import { getMemoryStore } from '../utils/window';
import { autobind } from 'core-decorators';
import { authentication } from '../mixins';
import Session, { VerificationStatusType } from '../interface/session';
import CreateMnemonicWords from '../utils/mnemonicWords';

const USERSTORENAME = `${APPNAME}-user`;

const createMnemonicWords = new CreateMnemonicWords(3);
export interface UserLoginParams {
  username: string;
  password: string;
}

export interface UserRegisterParams extends UserLoginParams {
  repeatPassword: string;
  email: string;
  mnemonicWords: string;
}

export interface UserModifyParams extends UserLoginParams {
  email: string;
  mnemonicWords: string;
}

export interface UserModifyPassword {
  username?: string;
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
  mnemonicWords: string;
}

const session = new Session();
@autobind
class User extends Store {
  constructor() {
    super();
  }

  // 生成密码
  private _createPassword(password: string, salt?: string) {
    if (!salt) {
      throw new Error('_createPassword::[salt参数为空]');
    }

    return MD5(salt + password + salt);
  }

  // 获取用户信息
  private _checkUserInfo(username?: string) {
    if (!username) {
      throw new Error('_checkUserInfo::[username参数为空]');
    }

    const users = this.$arraySearch(USERSTORENAME, [
      { key: 'username', value: username, include: false },
    ]);

    const user = users.length ? users[0] : {};

    return {
      length: users.length,
      user,
    };
  }

  // 验证密码
  private _verificationPassword(username?: string, password?: string) {
    if (!username) {
      throw new Error('_verificationPassword::[username参数为空]');
    }

    if (!password) {
      throw new Error('_verificationPassword::[password参数为空]');
    }

    const users = this._checkUserInfo(username);

    if (users.length <= 0) {
      throw new Error('用户不存在');
    }

    return (
      this._createPassword(password, users.user.salt) === users.user.password
    );
  }

  private _createMnemonicWords() {
    const mnemonicWords = createMnemonicWords.create();

    const formatWords = mnemonicWords
      .map((str: string) => str.split('').join(','))
      .join(',');

    return formatWords;
  }

  // 修改密码
  private _passwordModify({
    username,
    newPassword,
    confirmPassword,
    mnemonicWords,
  }: UserModifyPassword) {
    const { user } = this._checkUserInfo(username);

    if (newPassword !== confirmPassword) return '两次密码输入不一致';

    const md5Str = this._createPassword(mnemonicWords, username);

    if (md5Str !== user.mnemonicWords) return '助记词输入有误';

    const salt = randomString(16);

    const password = this._createPassword(confirmPassword, salt);

    return this.$arrayUpdate(USERSTORENAME, { password, salt }, user.id);
  }

  // 登录
  @authentication(false)
  async login({ username, password }: UserLoginParams) {
    if (!username) return '请输入用户名';

    if (!password) return '请输入密码';

    const users = this._checkUserInfo(username);

    if (users.length > 0) {
      const uData = users.user;

      const verification = this._verificationPassword(username, password);

      if (verification) {
        // 登录保存session
        const sessionid = await session.setSessionid(username);

        return {
          sessionid,
          username: uData.username,
          email: uData.email,
        };
      } else {
        return '密码错误';
      }
    } else {
      return '用户不存在';
    }
  }

  // 注册
  @authentication(false)
  async register({
    username,
    password,
    repeatPassword,
    email,
    mnemonicWords,
  }: UserRegisterParams) {
    if (!username) return '请输入用户名';
    if (!password) return '请输入密码';
    if (!repeatPassword) return '请再次输入密码';
    if (password !== repeatPassword) return '两次输入密码不一致';
    if (!email) return '请输入邮箱地址';

    const memoryStore = getMemoryStore();

    const users = this._checkUserInfo(username);

    if (users.length > 0) return `${username}用户已存在`;
    // 助记词校验
    const md5Str = this._createPassword(mnemonicWords, username);

    const memoryData = await memoryStore?.get(username);

    if (memoryData !== md5Str) return '助记词数据异常';

    const salt = randomString(16);

    const passwordMessage = this._createPassword(password, salt);

    this.$arrayAdd(USERSTORENAME, {
      username,
      password: passwordMessage,
      salt,
      email,
      mnemonicWords: md5Str,
    });

    return {
      username,
    };
  }

  // 生成助记词
  @authentication(false)
  async getMnemonicWords(username: string) {
    const users = this._checkUserInfo(username);

    if (users.length > 0) return `${username}用户已存在`;

    const memoryStore = getMemoryStore();

    const formatWords = this._createMnemonicWords();

    const md5Str = this._createPassword(formatWords, username);

    await memoryStore?.set(username, md5Str);

    return { mnemonicWords: formatWords };
  }

  // 获取用户详情
  @authentication
  async getUserInfo(userStatus: VerificationStatusType) {
    const { user } = this._checkUserInfo(userStatus.username);

    return {
      userid: user.id,
      username: user.username,
      email: user.email,
    };
  }

  // 验证密码(鉴权)
  @authentication
  async verificationPasswordAuth(
    userStatus: VerificationStatusType,
    data: { password: string }
  ) {
    return this._verificationPassword(userStatus.username, data.password);
  }

  // 验证密码
  @authentication(false)
  async verificationPassword({ username, password }: UserLoginParams) {
    return this._verificationPassword(username, password);
  }

  // 修改密码
  @authentication(false)
  async passwordModify(params: UserModifyPassword) {
    return this._passwordModify(params);
  }

  // 修改密码(鉴权)
  @authentication
  async passwordModifyAuth(
    userStatus: VerificationStatusType,
    params: UserModifyPassword
  ) {
    return this._passwordModify({
      username: userStatus.username,
      ...params,
    });
  }
}

export default User;
