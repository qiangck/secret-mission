const HANDLETYPES = {
  GET_ALL_LIST: 'GET_ALL_LIST',
  GET_BIN_LIST: 'GET_BIN_LIST',
  ADD_DATA: 'ADD_DATA',
  GET_DATA: 'GET_DATA',
  DEL_DATA: 'DEL_DATA',
  DEL_DATA_PHYSICS: 'DEL_DATA_PHYSICS',
  UPDATE_DATA: 'UPDATE_DATA',
  GET_SEARCH_LIST: 'GET_SEARCH_LIST',
  IMPORT_FILE_DATA: 'IMPORT_FILE_DATA',
  CHANGR_WINDOW_HEIGHT: 'CHANGR_WINDOW_HEIGHT',
  CLIPBOARD_DATA: 'CLIPBOARD_DATA',
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  CLOSE_SEARCH_WINDOW: 'CLOSE_SEARCH_WINDOW',
  GET_USER_INFO: 'GET_USER_INFO',
  USER_PASSWORD_MODIFY: 'USER_PASSWORD_MODIFY',
  GET_MNEMONIC_WORDS: 'GET_MNEMONIC_WORDS',
  CLEAR_LOGIN_STATUS: 'CLEAR_LOGIN_STATUS',
  VERIFICATIONPASSWORD: 'VERIFICATIONPASSWORD',
};

const SENDTYPE = {
  SEND_LOGIN_STATUS: 'SEND_LOGIN_STATUS',
};

const APPNAME = 'secretapp';
const HANDLENAME = 'secretfns';
const SESSIONNAME = 'session';
const SENDNAME = 'secretsend';

const STORE_DEFAULT_CONFIG = {
  // 存储文件名称
  name: `${APPNAME}-data`,
  // 加密密钥
  encryptionKey: APPNAME,
  // 存储文件扩展名
  fileExtension: 'json',
  // 监听数据更改
  watch: false,
};

const SUCCESSCODE = 0;
const FAILCODE = 1;
const NOLOGINCODE = 999;
const SERVERERROR = 500;

module.exports = {
  APPNAME,
  SESSIONNAME,
  HANDLETYPES,
  HANDLENAME,
  SENDTYPE,
  SENDNAME,
  STORE_DEFAULT_CONFIG,
  NOLOGINCODE,
  SUCCESSCODE,
  FAILCODE,
  SERVERERROR,
};