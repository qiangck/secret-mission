import { ElementType } from 'react';
import Home from './views/Home';
import Recycle from './views/Home/recycle';
import Settings from './views/Settings';

interface RouterType {
  key: number;
  name: string;
  path: string;
  index?: boolean;
}

interface RouterMapType {
  [propName: string]: ElementType;
}

export const router: RouterType[] = [
  {
    key: 1,
    name: '所有项目',
    path: '/',
    index: true,
  },
  { key: 2, name: '回收站', path: '/recycle' },
  { key: 3, name: '设置', path: '/settings' },
];

export const routerMap: RouterMapType = {
  '/': Home,
  '/recycle': Recycle,
  '/settings': Settings,
};
