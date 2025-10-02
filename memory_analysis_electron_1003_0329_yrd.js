// 代码生成时间: 2025-10-03 03:29:21
const { app, BrowserWindow, shell } = require('electron');
const os = require('os');
const { exec } = require('child_process');

/**
 * 获取当前系统的内存使用情况
 * @returns {Promise<Object>} 包含内存使用情况的对象
 */
function getMemoryUsage() {
    return new Promise((resolve, reject) => {
        exec('free', (error, stdout) => {
            if (error) {
                reject(new Error('Failed to execute command: free'));
                return;
            }
            const lines = stdout.split('
');
            const memInfoLine = lines[1].split(/\s+/); // Split by one or more whitespace characters
            // Adjust the index based on your OS
            const memoryUsage = {
                total: parseInt(memInfoLine[1], 10) * 1024, // Total memory in bytes
                used: parseInt(memInfoLine[2], 10) * 1024, // Used memory in bytes
                free: parseInt(memInfoLine[3], 10) * 1024, // Free memory in bytes
            };
            resolve(memoryUsage);
        });
    });
}

/**
 * 创建并显示主窗口
 * @param {Object} memoryUsage - 内存使用情况对象
 */
function createWindow(memoryUsage) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('memory-usage', memoryUsage);
    });

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', async () => {
    try {
        const memoryUsage = await getMemoryUsage();
        createWindow(memoryUsage);
    } catch (error) {
        console.error(error);
        app.quit();
    }
});

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