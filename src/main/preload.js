const { contextBridge, ipcRenderer, app } = require('electron');
const { HANDLETYPES, HANDLENAME, SENDNAME, SENDTYPE } = require('./types');

const content = {};

const sendContent = {};

Object.keys(HANDLETYPES).forEach((key) => {
  content[key] = (...args) => {
    return ipcRenderer.invoke(HANDLETYPES[key], ...args);
  };
});

Object.keys(SENDTYPE).forEach((key) => {
  sendContent[key] = (callback) =>
    ipcRenderer.on(SENDTYPE.SEND_LOGIN_STATUS, (_, ...args) => {
      typeof callback === 'function' && callback(...args);
    });
});

contextBridge.exposeInMainWorld(SENDNAME, sendContent);
contextBridge.exposeInMainWorld(HANDLENAME, content);
