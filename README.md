Secret-Mission是一个密码管理桌面应用，使用Electron和React编写，所有密码数据均保存在本地，使用二进制文件存储，账户密码和用户密码均使用加密处理，使用简单、安全、快捷，使用前请仔细阅读使用说明。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2790246/1642671664186-f6703b8f-decd-4ac6-9915-66007a4dcf45.png#clientId=uec5680d1-fefa-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=709&id=u7df21acb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1418&originWidth=2048&originalType=binary&ratio=1&rotation=0&showTitle=false&size=531733&status=done&style=shadow&taskId=u1ac3cd98-901f-4d63-8ee1-ee46d4c0e37&title=&width=1024)
### 开发要求

- Node.js ^14.18.1 版本开发
- NPM ^6.14.15 版本开发
- Electron ^15.3.0 版本开发
- React ^17.0.2 版本开发

### 运行

`npm run start`dev开发
`npm run start:renderer`渲染进程dev打包
`npm run start:main`主进程dev开发
`npm run package`打包生成DMG文件

其他运行命令详见`package.json`

### 使用说明

1. 应用可以注册多个用户，密码数据相互隔离。
2. 新用户注册生成的助记词要保留在安全的地方，助记词是识别用户的重要数据，助记词不能修改，注意：**找回密码时候需要填写助记词**。
3. 删除的密码数据会进入到回收站列表，回收站如果删除将是物理删除。
4. 快捷搜索需要程序运行并且用户成功登录后使用。
5. 快捷搜索唤醒快捷键为`Command+Shift+Down`
6. 应用点击左上角关闭按钮为隐藏应用，再次退出为彻底关闭。

### 功能

- 登录界面
- [x] 登录
- [x] 注册
- [x] 生成助记词
- [x] 验证密码
- [x] 验证助记词
- [x] 修改密码
- 接口处理
- [x] 鉴权
- [x] 返回数据统一处理
- [x] 装饰器适应器
- [x] 缓存数据封装
- [x] IPC数据通信
- [x] 多用户数据分离
- 主界面
- [x] 封装数据存储
- [x] 获取全部列表
- [x] 获取有效数据列表
- [x] 查询列表
- [x] 添加数据
- [x] 获取单条数据
- [x] 更新数据
- [x] 删除数据
- [x] 物理删除数据
- [x] 登录退出
- [x] 修改密码
- [x] 回收站恢复数据
- [x] 密码生成器
- 快捷搜索界面
- [x] 复制密码
- [x] 快捷键使用
- [x] 搜索栏高度计算
- 即将迭代功能
- [ ] 数据的导入导出
- [ ] 定时清除剪切板密码Ï
- [ ] 菜单优化

### 免责声明
应用内容版权均为本人所有，若您需要引用、转载，只需要注明来源即可，免责声明最终解释权归本人所有。

