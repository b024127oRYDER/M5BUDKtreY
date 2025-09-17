// 代码生成时间: 2025-09-17 16:09:02
// Include necessary Electron modules
const { app, BrowserWindow } = require('electron');

// Function to sanitize input to prevent XSS attacks
function sanitizeInput(input) {
  // Here you would implement your sanitization logic, possibly using a library like DOMPurify
  // For demonstration purposes, we simply return the input
  // In a real-world scenario, you would replace or remove potentially dangerous characters
  return input;
}

// Create a new BrowserWindow instance
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Consider setting contextIsolation to true and using preload scripts to
      // increase security if your application's architecture allows for it.
    },
  });

  // Load a local HTML file in the BrowserWindow
  win.loadFile('index.html');

  // Open the DevTools for debugging
  win.webContents.openDevTools();
}

// Handle errors gracefully
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

// Example usage of sanitizeInput function
// This could be part of a form submission handler or similar
app.on('ready', () => {
  console.log('Sanitized input:', sanitizeInput('<h1>Hello World</h1>'));
});
