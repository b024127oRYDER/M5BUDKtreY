// 代码生成时间: 2025-10-12 03:23:30
// Import required modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Main window class
class DataDictionaryManager {
  constructor() {
    this.win = null;
  }

  // Create the main window
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.win.loadFile('index.html');

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  // Handle data dictionary operations
  handleOperation(operation, data) {
    try {
      switch (operation) {
        case 'add':
          this.addData(data);
          break;
        case 'update':
          this.updateData(data);
          break;
        case 'delete':
          this.deleteData(data);
          break;
        default:
          throw new Error('Unsupported operation');
      }
    } catch (error) {
      console.error('Error handling operation:', error);
      this.sendErrorResponse(error.message);
    }
  }

  // Add data to the dictionary
  addData(data) {
    // Read the current dictionary data
    const currentData = this.readData();
    // Add new data
    currentData.push(data);
    // Write back to file
    this.writeData(currentData);
  }

  // Update data in the dictionary
  updateData(data) {
    // Read the current dictionary data
    const currentData = this.readData();
    // Find and update the data
    const index = currentData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      currentData[index] = data;
      this.writeData(currentData);
    } else {
      throw new Error('Data not found');
    }
  }

  // Delete data from the dictionary
  deleteData(data) {
    // Read the current dictionary data
    const currentData = this.readData();
    // Filter out the data to delete
    const updatedData = currentData.filter(item => item.id !== data.id);
    // Write back to file
    this.writeData(updatedData);
  }

  // Read data from the dictionary file
  readData() {
    try {
      const file = fs.readFileSync('data_dictionary.json', 'utf8');
      return JSON.parse(file);
    } catch (error) {
      throw new Error('Failed to read dictionary data');
    }
  }

  // Write data to the dictionary file
  writeData(data) {
    try {
      fs.writeFileSync('data_dictionary.json', JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error('Failed to write dictionary data');
    }
  }

  // Send error response to the renderer process
  sendErrorResponse(message) {
    this.win.webContents.send('error-response', message);
  }

  // Send success response to the renderer process
  sendSuccessResponse(message) {
    this.win.webContents.send('success-response', message);
  }
}

// Event listener for app ready
app.on('ready', () => {
  const manager = new DataDictionaryManager();
  manager.createWindow();

  // Handle incoming operations from the renderer process
  ipcMain.on('data-operation', (event, operation, data) => {
    manager.handleOperation(operation, data);
  });
});

// Event listener for window close
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Event listener for app activation
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const manager = new DataDictionaryManager();
    manager.createWindow();
  }
});