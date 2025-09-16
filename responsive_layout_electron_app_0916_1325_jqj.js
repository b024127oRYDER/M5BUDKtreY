// 代码生成时间: 2025-09-16 13:25:56
const { app, BrowserWindow } = require('electron');

// 定义窗口的初始宽度和高度
const mainWindowWidth = 800;
const mainWindowHeight = 600;

// 创建BrowserWindow窗口并加载应用
function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: mainWindowWidth,
    height: mainWindowHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 出于安全考虑，建议在生产环境中启用contextIsolation
    },
  });

  // 并且加载应用的index.html文件
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 当Electron完成初始化并准备创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow);
a
// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在macOS上，当用户按下Command + Q时，退出应用
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 错误处理
app.on('will-quit', () => {
  console.log('App will quit');
});

// 定义一个响应式布局函数
function responsiveLayout() {
  // 获取所有窗口
  const windows = BrowserWindow.getAllWindows();

  // 循环遍历每个窗口
  windows.forEach((win) => {
    // 获取窗口的当前大小
    const [width, height] = win.getContentSize();

    // 根据窗口大小调整布局
    if (width < mainWindowWidth || height < mainWindowHeight) {
      // 这里可以添加调整布局的代码
      console.log('Adjusting layout for a responsive design');
    }
  });
}

// 监听屏幕大小变化事件
const screen = require('electron').screen;
screen.on('display-added', responsiveLayout);
a
// 以下是模拟的index.html内容，实际应用中应将其放在项目目录下的index.html文件中
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Responsive Layout Electron App</title>
<style>
  /* 基础样式 */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  /* 响应式布局样式 */
  @media (max-width: 800px) {
    .container {
      padding: 10px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <h1>Responsive Layout Electron App</h1>
    <p>This is a responsive layout designed for Electron.</p>
  </div>
</body>
</html>`;