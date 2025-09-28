// 代码生成时间: 2025-09-28 23:34:30
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { summarizeText } = require('./text_summarizer'); // Assuming a separate module for text summarization logic

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Create a function to generate the summary of a text file
function generateSummary(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const summary = summarizeText(content);
    console.log('Text Summary:', summary);
    // Implement functionality to save or display the summary
  } catch (error) {
    console.error('Error reading file:', error);
    dialog.showErrorBox('Error', `Failed to read file: ${error.message}`);
  }
}

// Create main window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html'); // Load the HTML file that will contain your UI
  // Open the DevTools.
  win.webContents.openDevTools();

  // Handle window close event to ensure proper cleanup
  win.on('closed', () => {
    // Dereference the window object, so it can be garbage collected
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Event to handle file opening
app.on('open-file', (event, filePath) => {
  // Prevent other files from being opened
  event.preventDefault();
  // Generate summary when a file is opened
  generateSummary(filePath);
});

/**
 * Module: text_summary_generator.js
 * Description: Main process file for Electron app to generate text summaries.
 * This file handles the creation of the main window and integrates with
 * the file system to read and summarize text files.
 *
 * Usage:
 * - The app will open a window where users can interact with the UI to generate summaries.
 * - When a file is opened via the app, it triggers the summary generation.
 *
 * Dependencies:
 * - Electron: For creating the desktop application.
 * - fs: Node.js module for file system operations.
 * - path: Node.js module for file path operations.
 * - text_summarizer: A custom module for text summarization logic.
 */