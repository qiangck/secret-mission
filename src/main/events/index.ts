import { ipcMain, dialog, clipboard } from 'electron';
import fs from 'fs';
import { HANDLETYPES, SENDTYPE } from '../types';
import Interface from '../interface';
import { getOutWindow, getWindow } from '../utils/window';

type OptionType = {
  sessionToken: string;
};

interface APITYPE {
  data: {
    [propsname: string]: any;
  };
  options: OptionType;
}

export const handleEvent = () => {
  const outWindow = getOutWindow();

  const user = new Interface.User();
  const list = new Interface.List();
  const session = new Interface.Session();

  // store.onDidChange(LISTNAME, (newValue, oldValue) => {
  //   console.log(newValue, '========================>watch\nd');
  // });

  const handles = {
    // 获取全部列表
    [HANDLETYPES.GET_ALL_LIST](data: APITYPE) {
      return list.getAllList(data);
    },
    // 获取回收站列表
    [HANDLETYPES.GET_BIN_LIST](data: APITYPE) {
      return list.getBinList(data);
    },
    // 搜索列表
    [HANDLETYPES.GET_SEARCH_LIST](data: APITYPE) {
      return list.getSearchList(data);
    },
    // 添加数据
    [HANDLETYPES.ADD_DATA](data: APITYPE) {
      return list.addData(data);
    },
    // 获取单条数据
    [HANDLETYPES.GET_DATA](data: APITYPE) {
      return list.getData(data);
    },
    // 更新单条数据
    [HANDLETYPES.UPDATE_DATA](data: APITYPE) {
      return list.updateData(data);
    },
    // 软删除数据
    [HANDLETYPES.DEL_DATA](data: APITYPE) {
      return list.delData(data);
    },
    // 物理删除
    [HANDLETYPES.DEL_DATA_PHYSICS](data: APITYPE) {
      return list.delDataPhysics(data);
    },
    // txt导入数据
    async [HANDLETYPES.IMPORT_FILE_DATA]() {
      const paths = await dialog.showOpenDialog({
        filters: [{ name: 'Text文件', extensions: ['text'] }],
        properties: ['openFile', 'multiSelections'],
        message: '选择要导入的Text文件',
        buttonLabel: '导入',
      });

      if (!paths.canceled) {
        const fileContents = paths.filePaths.map((filePaths: string) => {
          const text: Buffer = fs.readFileSync(filePaths);

          const textString: string = text.toString();

          const textArray: string[] = textString.replace(/\n/g, '|').split('|');

          const formatValue = textArray
            .filter((item: string) => !!item)
            .map((item: string) => {
              const content: string[] = item.split(' ');

              return {
                name: content[0] || '',
                username: content[1] || '',
                password: content[2] || '',
                remarks: content
                  .filter((_: string, index: number) => index > 2)
                  .join(','),
              };
            });

          return formatValue;
        });

        return fileContents;
      }
      return '用户取消选择';
    },
    // 修改视窗高度
    [HANDLETYPES.CHANGR_WINDOW_HEIGHT](options: {
      width?: number;
      height?: number;
    }) {
      if (outWindow) {
        const [getWidth, getHeight] = outWindow.getSize();

        outWindow.setSize(
          options.width || getWidth,
          options.height || getHeight
        );
      }
    },
    // 复制密码
    [HANDLETYPES.CLIPBOARD_DATA](text?: string) {
      if (text) {
        clipboard.writeText(text);
      }
    },
    // 用户登录
    [HANDLETYPES.USER_LOGIN](data: APITYPE) {
      return user.login(data);
    },
    // 用户注册
    [HANDLETYPES.USER_REGISTER](data: APITYPE) {
      return user.register(data);
    },
    // 生成助记词
    [HANDLETYPES.GET_MNEMONIC_WORDS](data: APITYPE) {
      return user.getMnemonicWords(data);
    },
    // 修改用户密码
    [HANDLETYPES.USER_PASSWORD_MODIFY](data: APITYPE) {
      return data.data.username
        ? user.passwordModify(data)
        : user.passwordModifyAuth(data);
    },
    // 验证密码
    [HANDLETYPES.VERIFICATIONPASSWORD](data: APITYPE) {
      return data.data.username
        ? user.verificationPassword(data)
        : user.verificationPasswordAuth(data);
    },
    // 获取用户信息
    [HANDLETYPES.GET_USER_INFO](data: APITYPE) {
      return user.getUserInfo(data);
    },
    // 关闭搜索窗口
    [HANDLETYPES.CLOSE_SEARCH_WINDOW]() {
      outWindow?.hide();
      outWindow?.reload();
    },
    // 清楚登录session
    [HANDLETYPES.CLEAR_LOGIN_STATUS]() {
      return session.clearSessionid();
    },
  };

  Object.keys(handles).map((handlesName) =>
    ipcMain.handle(handlesName, (_, ...rest: any[]) => {
      const fn: Function = handles[handlesName];

      return fn && fn(...rest);
    })
  );
};

export let sendEvent: any = {};

Object.keys(SENDTYPE).forEach((key) => {
  sendEvent[key] = (...args: any[]) => {
    const mainWindow = getWindow();
    return mainWindow?.webContents.send(key, ...args);
  };
});
