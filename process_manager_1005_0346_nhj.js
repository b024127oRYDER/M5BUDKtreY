// 代码生成时间: 2025-10-05 03:46:21
const { app, BrowserWindow, shell } = require('electron');
const os = require('os');
const { exec } = require('child_process');

// Function to get system processes
function getSystemProcesses() {
  return new Promise((resolve, reject) => {
    // Platform-specific command to list processes
    const cmd = os.platform() === 'win32' ? 'tasklist' : 'ps ax';
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to terminate a process
function terminateProcess(processId) {
  return new Promise((resolve, reject) => {
    // Platform-specific command to terminate a process
    const cmd = os.platform() === 'win32' ? `taskkill /PID ${processId} /F` : `kill -9 ${processId}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Create a BrowserWindow
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the DevTools for debugging
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Event when the window is closed.
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

// Export functions to be used in renderer process
exports.getSystemProcesses = getSystemProcesses;
exports.terminateProcess = terminateProcess;
