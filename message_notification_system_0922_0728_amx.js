// 代码生成时间: 2025-09-22 07:28:24
const { app, BrowserWindow, Notification } = require('electron');

// 创建消息通知系统的主要功能
class MessageNotificationSystem {
  constructor() {
    this.notificationsEnabled = true;
  }

  // 检查通知是否启用
  areNotificationsEnabled() {
    return this.notificationsEnabled;
  }

  // 启用或禁用通知
  setNotificationsEnabled(enabled) {
    this.notificationsEnabled = enabled;
  }

  // 发送通知
  sendNotification(title, body) {
    if (!this.areNotificationsEnabled()) {
      console.warn('Notifications are disabled.');
      return;
    }

    const notification = new Notification({
      title: title,
      body: body,
      icon: `${__dirname}/assets/notification-icon.png` // 假设有一个图标文件
    });

    notification.show();
  }
}

// Electron 主进程代码
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

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

// 实例化消息通知系统
const notificationSystem = new MessageNotificationSystem();

// 示例：发送一个通知
notificationSystem.sendNotification('Hello', 'This is a test notification from our message notification system.');