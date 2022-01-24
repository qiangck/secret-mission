/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string, hashURL?: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string, hashURL?: string) => {
    const url = new URL(`http://localhost:${port}#/${hashURL || ''}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string, hashURL?: string) => {
    // return `app://${path.resolve(__dirname, '../../../release/app/dist/renderer/', htmlFileName)}`;
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}#/${hashURL || ''}`;
  };
}

export const getDominName = () => {
  const path = resolveHtmlPath('index.html');

  const url = new URL(path);

  return url.pathname;
};

export const randomString = (len = 16) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

  const maxPos = $chars.length;

  let pwd = '';

  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }

  return pwd;
};
export const getResponse = (code: number, msg: string, data?: any) => {
  return {
    code: code || 0,
    msg: msg || 'success',
    data: data === (undefined || null || '') ? {} : data,
  };
};
