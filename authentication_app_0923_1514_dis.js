// 代码生成时间: 2025-09-23 15:14:21
// Import necessary modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Define the user model with authentication properties
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Hash the password for storage
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

// Main authentication function
async function authenticateUser(username, password) {
  try {
    // Retrieve user data from storage
    const userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));

    // Find the user with the given username
    const user = userData.find(u => u.username === username);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    // Authentication successful
    return true;
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error('Authentication error:', error.message);
    return false;
  }
}

// Function to create a new user
async function createUser(username, password) {
  try {
    // Create a new user instance
    const newUser = new User(username, password);
    await newUser.hashPassword();

    // Retrieve existing users and add the new user
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
    } catch (error) {
      // If no users.json exists, create a new array
    }
    users.push(newUser);

    // Save the updated user list to storage
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error('User creation error:', error.message);
  }
}

// Electron application setup
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools();
}

// Handle creating/removing shortcuts in the applications startup/shutdown
app.whenReady().then(createWindow).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC listeners for handling authentication from the renderer process
ipcMain.handle('authenticate', async (event, args) => {
  const { username, password } = args;
  return authenticateUser(username, password);
});

ipcMain.handle('create-user', async (event, args) => {
  const { username, password } = args;
  await createUser(username, password);
  return true;
});

// Error handling for uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});