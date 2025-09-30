// 代码生成时间: 2025-10-01 02:52:24
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

// 环境变量管理器类
class EnvironmentManager {
  constructor() {
    this.win = null;
  }

  // 初始化窗口
  createWindow() {
    // 创建浏览器窗口。
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // 加载应用的 index.html 文件。
    this.win.loadFile('index.html');
  }

  // 读取环境变量
  readEnvVariables() {
    try {
      const envVariables = Object.entries(process.env);
      return envVariables;
    } catch (error) {
      console.error('Error reading environment variables:', error);
      return null;
    }
  }

  // 保存环境变量
  saveEnvVariables(newEnvVariables) {
    try {
      // 遍历新环境变量并设置
      Object.entries(newEnvVariables).forEach(([key, value]) => {
        process.env[key] = value;
      });
      console.log('Environment variables updated successfully.');
    } catch (error) {
      console.error('Error saving environment variables:', error);
    }
  }

  // 打开环境变量编辑窗口
  openEditWindow() {
    // 创建一个新的 BrowserWindow 用于环境变量编辑
    const editWin = new BrowserWindow({
      parent: this.win,
      modal: true,
      width: 600,
      height: 400,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // 加载环境变量编辑页面
    editWin.loadFile('edit_env_variables.html');
  }
}

// 确保这个脚本在 Electron 应用程序的主线程中运行。
if (require.main === module) {
  // 创建环境变量管理器实例
  const envManager = new EnvironmentManager();

  // 应用程序启动时创建窗口
  app.whenReady().then(() => {
    envManager.createWindow();
  });

  // 应用程序的所有窗口都被关闭时退出。
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // 重新激活应用程序时创建窗口。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      envManager.createWindow();
    }
  });
}
