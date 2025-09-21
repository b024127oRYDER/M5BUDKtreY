// 代码生成时间: 2025-09-21 10:42:26
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { dialog } = require('@electron/remote');

// 创建一个窗口的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  });

  // 加载index.html
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 预加载脚本的路径
const preloadPath = path.join(__dirname, 'preload.js');

// 这个函数用于处理上传文件和数据清洗
function processData(file) {
  try {
    // 读取文件内容
    const data = fs.readFileSync(file, 'utf8');
    // 数据清洗和预处理逻辑（示例）
    const cleanedData = data.replace(/\s+/g, ' ').trim();
    // 返回清洗后的数据
    return cleanedData;
  } catch (error) {
    // 错误处理
    console.error('Error processing data:', error);
    throw new Error('Failed to process data');
  }
}

// Electron生命周期事件监听器
app.whenReady().then(createWindow);

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

// 预加载脚本示例
// 在 preload.js 中，你可以定义全局上下文和远程模块的访问规则
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  // 允许渲染器进程调用processData函数
  processData: (file) => ipcRenderer.invoke('process-data', file),
  // 打开文件对话框
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
});

// 主进程中处理渲染器进程的请求
ipcRenderer.on('process-data', async (event, file) => {
  return processData(file);
});

ipcRenderer.on('open-file-dialog', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (!canceled && filePaths.length > 0) {
    event.reply('selected-file', filePaths[0]);
  }
});

// HTML模板（index.html）的示例
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Data Cleaning Tool</title>
//   </head>
//   <body>
//     <button id="openFile">Open File</button>
//     <script src="renderer.js"></script>
//   </body>
// </html>

// 渲染器进程脚本（renderer.js）的示例
// document.getElementById('openFile').addEventListener('click', async () => {
//   const file = await window.electronAPI.openFileDialog();
//   if (file) {
//     const cleanedData = await window.electronAPI.processData(file);
//     console.log('Cleaned Data:', cleanedData);
//   }
// });