// 代码生成时间: 2025-09-16 00:03:24
const { app, BrowserWindow } = require('electron');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');

/**
 * 获取系统内存使用情况
 * @returns {Promise} - 包含内存使用情况的Promise对象
 */
function getMemoryUsage() {
  return new Promise((resolve, reject) => {
    // 根据操作系统选择不同的命令来获取内存使用情况
    if (os.platform() === 'win32') {
      // Windows系统
      exec('wmic OS get FreePhysicalMemory,TotalVirtualMemorySize,TotalVisibleMemorySize', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    } else if (os.platform() === 'darwin') {
      // macOS系统
      exec('hostinfo | grep Memory', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    } else {
      // 其他系统
      exec('free -m', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    }
  });
}

/**
 * 创建并显示主窗口
 * @param {String} memoryUsage - 内存使用情况的字符串
 */
function createWindow(memoryUsage) {
  let win;
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile('index.html');
  // 将内存使用情况传给前端
  win.webContents.send('memory-usage', memoryUsage);
  
  win.on('closed', () => {
    win = null;
  });
}

// 程序启动时执行
app.on('ready', async () => {
  try {
    const memoryUsage = await getMemoryUsage();
    createWindow(memoryUsage);
  } catch (error) {
    console.error('Failed to get memory usage:', error);
  }
});

// 确保所有窗口关闭后退出程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在活动托盘点击时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});