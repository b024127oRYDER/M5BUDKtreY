// 代码生成时间: 2025-10-03 23:12:48
// Import necessary modules
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Function to create a window
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile('index.html');

  // Open the devtools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(createWindow);

// Quit the application when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, it's common to re-create a window in the app when the dock icon is clicked.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle errors
app.on('error', (error) => {
  console.error('An error occurred:', error);
});

// Function to handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Preload script that will run in the renderer context
// It exposes some node functionality to the renderer
const preload = `// Preload script to handle Electron-specific logic before the page loads
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Function to send a message to the main process
  sendStatusUpdate: (status) => ipcRenderer.send('status-update', status),
});

module.exports = { contextBridge }`;

// Main renderer file: index.html
const renderer = `<!DOCTYPE html>
<html lang=