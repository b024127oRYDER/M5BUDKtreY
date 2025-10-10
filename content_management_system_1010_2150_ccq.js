// 代码生成时间: 2025-10-10 21:50:59
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建窗口和加载应用程序的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  win.webContents.openDevTools();
}

// 监听渲染进程发送的保存内容的事件
ipcMain.on('save-content', (event, content) => {
  try {
    // 将内容保存到文件
    const contentFilePath = path.join(app.getPath('documents'), 'content.txt');
    fs.writeFileSync(contentFilePath, content);
    event.reply('content-saved', 'Content saved successfully.');
  } catch (error) {
    event.reply('content-save-error', error.message);
  }
});

// 应用程序准备好后创建窗口
app.on('ready', createWindow);

// 所有窗口关闭时退出应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用程序并创建新窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});