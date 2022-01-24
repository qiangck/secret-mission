import { message } from 'antd';
import { getSession } from '../utils';
import createHistory from 'history/createHashHistory';

const history = createHistory();

// 获取数据接口
export const get = async (
  name: string,
  data?: any,
  options?: {
    noVerification: boolean;
  }
) => {
  const fn = window.secretfns[name];

  if (typeof fn !== 'function')
    return new TypeError('interface name does not exist');

  const result = await fn({
    data,
    options: {
      sessionToken: getSession(),
    },
  });

  // 不需要验证
  if (options?.noVerification === true) {
    return Promise.resolve(result);
  }

  if (result.code === 999) {
    history.replace('/login');

    message.error('请重新进行登录');

    return Promise.reject(result);
  }

  if (result.code === 0) {
    return result;
  } else {
    message.error(result.msg);

    return Promise.reject(result);
  }
};

// 推送消息回调
export const send = (
  name: string,
  callback: (err: Error | null, ...rest: any[]) => void
) => {
  const fn = window.secretsend[name];

  if (typeof callback === 'function') {
    if (typeof fn !== 'function') {
      callback(new TypeError('interface name does not exist'));
    }
    fn((...args: any[]) => callback(null, ...args));
  }
};
