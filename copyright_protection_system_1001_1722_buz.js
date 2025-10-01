// 代码生成时间: 2025-10-01 17:22:48
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 版权保护系统主模块
class CopyrightProtectionSystem {
  constructor() {
    // 初始化Electron窗口
    this.initWindow();
  }

  // 初始化Electron窗口
  initWindow() {
    // 确保应用在所有窗口关闭后退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('ready', () => {
      this.createWindow();
    });
  }

  // 创建Electron窗口
  createWindow() {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    });

    // 加载版权保护系统的HTML界面
    mainWindow.loadFile('index.html');

    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  }

  // 处理版权验证请求
  verifyCopyright(event, filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      // 这里添加版权验证逻辑
      // 例如检查文件中的特定字符串或元数据
      console.log('File content:', fileContent);

      // 发送验证结果到渲染进程
      event.sender.send('verify-result', '版权验证成功');
    } catch (error) {
      console.error('版权验证失败:', error);
      event.sender.send('verify-result', '版权验证失败');
    }
  }
}

// 创建版权保护系统实例
const copyrightSystem = new CopyrightProtectionSystem();

// 监听版权验证请求
ipcMain.on('verify-copyright', (event, filePath) => {
  copyrightSystem.verifyCopyright(event, filePath);
});