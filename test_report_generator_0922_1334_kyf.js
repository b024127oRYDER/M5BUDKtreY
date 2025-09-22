// 代码生成时间: 2025-09-22 13:34:55
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { generateReport } = require('./report_generator'); // 假设 report_generator 是一个模块，用于生成报告

/**
 * 创建一个报告生成器窗口
 */
function createTestReportGeneratorWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html'); // 加载主页面

  win.on('closed', () => {
    win = null;
  });
}

/**
 * 在所有窗口关闭后退出应用程序
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createTestReportGeneratorWindow();
  }
});

/**
 * 生成测试报告
 * @param {Object} testData - 测试数据
 */
async function generateTestReport(testData) {
  try {
    // 调用 report_generator 模块的 generateReport 函数
    const reportPath = await generateReport(testData);
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
      if (filePaths && filePaths.length > 0) {
        fs.copyFileSync(reportPath, filePaths[0]); // 将报告复制到用户选择的路径
      }
    });
  } catch (error) {
    console.error('生成测试报告失败:', error);
  }
}

// 预加载脚本，用于在渲染进程中暴露 generateTestReport 函数
const preloadScript = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateTestReport: async (testData) => {
    return ipcRenderer.invoke('generate-test-report', testData);
  },
});
`;

// 保存预加载脚本到文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript, 'utf8');

// 在主进程中处理渲染进程的请求
ipcMain.on('generate-test-report', async (event, testData) => {
  await generateTestReport(testData);
});

app.whenReady().then(() => {
  createTestReportGeneratorWindow();
});