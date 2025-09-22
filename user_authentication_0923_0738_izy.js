// 代码生成时间: 2025-09-23 07:38:26
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Helper function to load the authentication credentials
async function loadCredentials() {
  try {
    const credentials = await readFileAsync(path.join(__dirname, 'credentials.json'), 'utf8');
    return JSON.parse(credentials);
  } catch (err) {
    console.error('Error loading credentials:', err);
    return null;
  }
}

// Helper function to save the authentication credentials
async function saveCredentials(credentials) {
  try {
    await writeFileAsync(path.join(__dirname, 'credentials.json'), JSON.stringify(credentials, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving credentials:', err);
  }
}

// Function to authenticate user
async function authenticateUser(username, password) {
  const credentials = await loadCredentials();
  if (!credentials) {
    console.error('No credentials found');
    return false;
  }
  
  if (credentials.username === username && credentials.password === password) {
    return true;
  } else {
    console.error('Authentication failed');
    return false;
  }
}

// Create a BrowserWindow to display the authentication form
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

// Main function to initialize the Electron app
function main() {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (BrowserWindow.getAllWindows().length) {
        BrowserWindow.getAllWindows()[0].focus();
      }
    });
  }

  app.on('ready', createWindow);
  
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
}

// Preload script to expose authentication function to the renderer process
const preload = `
  const { contextBridge, ipcRenderer } = require('electron');
  const authenticateUser = async (username, password) => {
    return await ipcRenderer.invoke('authenticate', username, password);
  };

  contextBridge.exposeInMainWorld('api', {
    authenticateUser,
  });
`;

// Save the preload script to a file
writeFileAsync(path.join(__dirname, 'preload.js'), preload, 'utf8')
  .then(() => console.log('Preload script created successfully'))
  .catch((err) => console.error('Error creating preload script:', err));

// Run the Electron app
main();