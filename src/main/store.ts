import Store from 'electron-store';
import { STORE_DEFAULT_CONFIG } from './types';

export type SearchListValue = boolean | string | number;

interface SearchList {
  key: string;
  value: SearchListValue;
  include: boolean;
}

export default class NewStore extends Store {
  constructor() {
    super(STORE_DEFAULT_CONFIG);
  }

  $arrayAll(key: string) {
    const getVal = this.get(key) || [];

    if (this.has(key) && Array.isArray(getVal)) {
      return getVal;
    }
    return [];
  }

  // 数组添加
  $arrayAdd(key: string, value: any) {
    const getVal = this.$arrayAll(key);

    getVal.push({
      id: getVal.length + 1,
      ...value,
      isDel: false,
      creatTime: Date.now(),
      updateTime: Date.now(),
    });

    this.set(key, getVal);
  }

  // 数组更新
  $arrayUpdate(key: string, value: any, id: number) {
    const getVal = this.$arrayAll(key);

    this.set(
      key,
      getVal.map((item) =>
        item.id === id
          ? {
              ...item,
              ...value,
              updateTime: Date.now(),
            }
          : item
      )
    );
  }

  // 数组删除
  $arrayDelete(key: string, id: number, physics = false) {
    const getVal = this.$arrayAll(key);

    const value = physics
      ? getVal.filter((item) => item.id !== id)
      : getVal.map((item) =>
          item.id === id
            ? { ...item, isDel: true, updateTime: Date.now() }
            : item
        );

    this.set(key, value);
  }

  // 数据获取
  $arrayCheck(key: string, id: number) {
    const getVal = this.$arrayAll(key);

    const filter = getVal.filter((item) => item.id === id);

    return filter.length > 0 ? filter[0] : null;
  }

  // 数据筛选
  $arraySearch(key: string, keywordMap?: SearchList[]) {
    const getVal = this.$arrayAll(key);

    if (Array.isArray(keywordMap) && keywordMap.length > 0) {
      return getVal.filter((item) =>
        keywordMap.every((keyword) =>
          keyword.include
            ? item[keyword.key].includes(keyword.value)
            : item[keyword.key] === keyword.value
        )
      );
    }

    return getVal;
  }
}
