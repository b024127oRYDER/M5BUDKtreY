// 代码生成时间: 2025-10-07 20:26:58
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { scheduleMaintenance } = require('./maintenance_scheduler'); // 引入维护调度函数

// 创建浏览器窗口的主函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // 加载设备预测维护的HTML文件
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 当 Electron 完成初始化并准备创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow);
a
// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，如果没有打开窗口，那么当点击dock图标时，重新创建一个窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 错误处理
app.on('will-finish-launching', () => {
  app.on('open-file', (event, path) => {
    event.preventDefault();
    // 处理文件打开事件
    handleOpenFile(path);
  });
});

// 处理文件打开事件
function handleOpenFile(filePath) {
  try {
    // 读取文件内容
    const data = fs.readFileSync(filePath, 'utf8');
    // 根据文件内容进行设备预测维护
    scheduleMaintenance(data);
  } catch (error) {
    console.error('Error handling file:', error);
  }
}

// 导出模块，供其他文件使用
module.exports = {
  handleOpenFile,
};

// 维护调度器模块，用于处理实际的维护任务
// maintenance_scheduler.js
// 这个模块应该包含实际的维护逻辑，例如根据设备状态预测并调度维护任务
// 此处省略了具体实现细节，可以根据实际需求进行扩展
function scheduleMaintenance(data) {
  // 此处应有实际的设备状态分析和维护调度逻辑
  // 示例代码
  console.log('Scheduling maintenance based on received data:', data);
}

// 确保维护调度器模块可以被其他文件引入
module.exports = {
  scheduleMaintenance,
};