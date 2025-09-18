// 代码生成时间: 2025-09-18 17:54:57
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
# FIXME: 处理边界情况
const path = require('path');
# 添加错误处理
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

// 自动更新配置
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

// 监听自动更新事件
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
# FIXME: 处理边界情况

autoUpdater.on('update- downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

// 创建浏览器窗口
# 添加错误处理
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
# NOTE: 重要实现细节
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载应用的 index.html
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'dist/index.html')}`);

  // 发生错误时打开开发者工具
  mainWindow.webContents.on('did-finish-load', () => {
# FIXME: 处理边界情况
    if (!isDev) {
      autoUpdater.checkForUpdates();
    }
  });

  // 打开开发者工具
  if (isDev) {
    mainWindow.webContents.openDevTools();
# TODO: 优化性能
  }
# 添加错误处理

  // 监听窗口关闭事件
# TODO: 优化性能
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
# FIXME: 处理边界情况

// 此方法将在Electron完成
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理来自渲染进程的消息
# 添加错误处理
ipcMain.on('show-notification', (event, message) => {
  // 显示桌面通知
  new Notification({
    title: 'Message Notification',
    body: message,
  }).show();
});

// 错误处理和日志记录
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});
# TODO: 优化性能

// 导出用于单元测试的函数
if (isDev) {
# 增强安全性
  module.exports = { createWindow, app };
}
