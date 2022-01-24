import {
  UserLoginParams,
  UserRegisterParams,
  UserModifyParams,
} from 'main/interface';

export type ImportDataType = {
  type: 'account' | 'network';
  name?: string;
  username?: string;
  password?: string;
  remarks?: string;
};

export type SecretfnsType = {
  GET_ALL_LIST: (value: string | undefined) => Promise<[]>;
  GET_BIN_LIST: (value: string | undefined) => Promise<[]>;
  GET_SEARCH_LIST: (value: string | undefined) => Promise<[]>;
  ADD_DATA: (value: unknown) => Promise<undefined>;
  GET_DATA: () => Promise<[]>;
  UPDATE_DATA: (value: unknown, id: number | undefined) => Promise<undefined>;
  DEL_DATA: (id: number | undefined) => Promise<undefined>;
  DEL_DATA_PHYSICS: (id: number | undefined) => Promise<undefined>;
  IMPORT_FILE_DATA: () => Promise<[ImportDataType]>;
  CHANGR_WINDOW_HEIGHT: (options: {
    width?: number;
    height?: number;
  }) => Promise<[undefined]>;
  CLIPBOARD_PASSWORD_DATA: (text?: string) => Promise<undefined>;
  USER_LOGIN: (data: UserLoginParams) => Promise<any>;
  USER_REGISTER: (data: UserRegisterParams) => Promise<any>;
  USER_MODIFY: (data: UserModifyParams) => Promise<any>;
  [propsname: string]: any;
};

export type secretsendType = {
  SEND_LOGIN_STATUS: (callback: (status: boolean) => void) => void;
  [propsname: string]: any;
};

declare global {
  interface Window {
    secretfns: SecretfnsType;
    secretsend: secretsendType;
  }
}
