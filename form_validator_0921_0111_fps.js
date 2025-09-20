// 代码生成时间: 2025-09-21 01:11:53
const electron = require('electron');
const { BrowserWindow } = electron;

// 创建一个简单的表单数据验证器
class FormValidator {
  // 构造函数，接收表单数据规则
  constructor(rules) {
    this.rules = rules;
  }

  // 验证表单数据的方法
  validate(data) {
    const errors = {};
    for (const key in this.rules) {
      const rule = this.rules[key];
      const value = data[key];
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue; // 如果该字段不是必填项，则跳过
      }
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[key] = `The field ${key} is required.`;
        continue;
      }
      if (rule.type === 'email' && !this.validateEmail(value)) {
        errors[key] = `The field ${key} must be a valid email.`;
      }
      if (rule.type === 'number' && isNaN(Number(value))) {
        errors[key] = `The field ${key} must be a number.`;
      }
    }
    return errors;
  }

  // 验证电子邮件格式的方法
  validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  }
}

// Electron主进程入口
class App {
  constructor() {
    this.window = null;
  }

  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    this.loadURL();
    this.setupWindowEvents();
  }

  loadURL() {
    this.window.loadURL('file://' + __dirname + '/index.html');
  }

  setupWindowEvents() {
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  // 启动应用
  start() {
    this.createWindow();
    electron.app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }
}

// 实例化App并启动
const app = new App();
app.start();