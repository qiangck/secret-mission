import { getResponse } from '../utils/util';
import { NOLOGINCODE, SUCCESSCODE, FAILCODE, SERVERERROR } from '../types';
import Adaption from './adaption';
import Session from '../interface/session';

function getStatusCode(res: any) {
  return typeof res === 'string'
    ? getResponse(FAILCODE, res)
    : getResponse(SUCCESSCODE, '', res);
}

const session = new Session();

/*
  @authentication(noVerification)
  noVerification: boolean

  如果为true则被装饰的函数入参增加用户登录状态参数并且进行登录校验

  class Test{
    @authentication
    getAuth(userStatus, params) {}

    @authentication(false)
    getNotAuth(params) {}
  }

  userStatus: {
    status: boolean;
    userid?: string;
    username?: string;
    sessionid?: string;
  }
*/
export const authentication = Adaption(function (
  _target: any,
  _name: any,
  descriptor: any,
  otherParams: any
) {
  const oldValue = descriptor.value;

  descriptor.value = async function () {
    try {
      const [args] = Array.prototype.slice.apply(arguments);

      const { data, options } = args;

      // 不进行校验
      const noVerification = otherParams === false;
      // 获取登录状态
      const userStatus = await session.verificationSessionid(
        options.sessionToken
      );

      const _value = oldValue.apply(
        this,
        noVerification ? [data] : [userStatus, data]
      );

      // 如果需要校验并且未登录返回用户未登录
      const noLogin = !userStatus.status && !noVerification;

      return Promise.resolve(_value)
        .then((res: any) => {
          return noLogin
            ? getResponse(NOLOGINCODE, '用户未登录')
            : getStatusCode(res);
        })
        .catch((err) => {
          return noLogin
            ? getResponse(NOLOGINCODE, '用户未登录')
            : getStatusCode(err.message);
        });
    } catch (err) {
      return getResponse(SERVERERROR, `系统内部错误[${err}]，请提交issuses`);
    }
  };

  return descriptor;
});
