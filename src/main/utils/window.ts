import { BrowserWindow } from 'electron';
import MemoryStore from './memoryStore';

let mainWindow: BrowserWindow | null = null;
let outWindow: BrowserWindow | null = null;
let memoryStore: MemoryStore | null = null;

export const getWindow = () => {
  return mainWindow
};

export const setWindow = (w: BrowserWindow) => {
  mainWindow = w;
};

export const getOutWindow = () => outWindow;

export const setOutWindow = (w: BrowserWindow) => {
  outWindow = w;
};

export const getMemoryStore = () => memoryStore;
export const setMemoryStore = (w: MemoryStore) => {
  memoryStore = w;
};
