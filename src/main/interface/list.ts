import { autobind } from 'core-decorators';
import { safeStorage } from 'electron';
import Store, { SearchListValue } from '../store';
import { APPNAME } from '../types';
import { authentication } from '../mixins';
import { VerificationStatusType } from './session';

const getListKey = (id: number | undefined) => {
  if (!id) {
    return '';
  }

  return `${APPNAME}-list.${id}`;
};

const getMainPassword = (value: { data: Buffer; type: string } | string) => {
  if (typeof value !== 'string' && value.type === 'Buffer') {
    return safeStorage.decryptString(Buffer.from(value.data));
  } else {
    return value;
  }
};

const setMainPassword = (value: string) => {
  if (value !== null && value !== undefined && value !== '') {
    return safeStorage.encryptString(value);
  }

  return '';
};
@autobind
@authentication
class List extends Store {
  constructor() {
    super();
  }

  // 获取全部列表
  async getAllList(userStatus: VerificationStatusType) {
    const key = getListKey(userStatus.userid);

    return this.$arraySearch(key);
  }

  // 获取有效列表
  async getBinList(userStatus: VerificationStatusType, data: SearchListValue) {
    const key = getListKey(userStatus.userid);

    return this.$arraySearch(key, [
      { key: 'projectname', value: data || '', include: true },
      { key: 'username', value: data || '', include: true },
      { key: 'isDel', value: true, include: false },
    ]);
  }

  // 查询列表
  async getSearchList(
    userStatus: VerificationStatusType,
    data: SearchListValue
  ) {
    const key = getListKey(userStatus.userid);

    return this.$arraySearch(key, [
      { key: 'projectname', value: data || '', include: true },
      { key: 'username', value: data || '', include: true },
      { key: 'isDel', value: false, include: false },
    ]);
  }

  // 添加数据
  async addData(userStatus: VerificationStatusType, data: any) {
    const key = getListKey(userStatus.userid);

    if (data.mainPassword) {
      data.mainPassword = setMainPassword(data.mainPassword);
    }

    this.$arrayAdd(key, data);
  }

  // 查询单条数据
  async getData(userStatus: VerificationStatusType, id: number) {
    const key = getListKey(userStatus.userid);

    const data = this.$arrayCheck(key, id);

    if (data.mainPassword) {
      data.mainPassword = getMainPassword(data.mainPassword);
    }

    return data;
  }

  // 更新数据
  async updateData(
    userStatus: VerificationStatusType,
    data: {
      [propsname: string]: SearchListValue;
      id: number;
    }
  ) {
    const key = getListKey(userStatus.userid);

    let params: any = {};

    Object.keys(data).forEach((key: string) => {
      if (key !== 'id') {
        params[key] = data[key];
      }

      if (key === 'mainPassword') {
        params[key] = setMainPassword(params[key]);
      }
    });

    this.$arrayUpdate(key, params, data.id);
  }

  // 删除数据
  async delData(userStatus: VerificationStatusType, id: number) {
    const key = getListKey(userStatus.userid);

    this.$arrayDelete(key, id);
  }

  // 永久删除数据
  async delDataPhysics(userStatus: VerificationStatusType, id: number) {
    const key = getListKey(userStatus.userid);

    this.$arrayDelete(key, id, true);
  }
}

export default List;
