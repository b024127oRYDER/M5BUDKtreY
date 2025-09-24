// 代码生成时间: 2025-09-24 08:42:21
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// 用户身份认证类
class UserAuthentication {
    constructor() {
        this.users = [
            { username: 'admin', password: 'password123' }
        ];
    }

    /**
     * 验证用户登录信息
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {boolean} 用户验证是否成功
     */
    authenticateUser(username, password) {
        const user = this.users.find(user => user.username === username);
        if (user && user.password === password) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 显示登录窗口
     * @returns {Promise<boolean>} 用户登录是否成功
     */
    showLoginWindow() {
        return new Promise((resolve, reject) => {
            const loginWindow = new BrowserWindow({
                width: 400,
                height: 200,
                resizable: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });

            loginWindow.loadFile(path.join(__dirname, 'login.html'));

            loginWindow.on('closed', () => {
                loginWindow = null;
            });

            // 监听用户提交登录信息事件
            loginWindow.webContents.on('did-finish-load', () => {
                loginWindow.webContents.send('ready');
            });

            loginWindow.webContents.on('login', (event, username, password) => {
                if (this.authenticateUser(username, password)) {
                    resolve(true);
                } else {
                    resolve(false);
                    dialog.showErrorBox('登录失败', '用户名或密码错误');
                }
                loginWindow.close();
            });
        });
    }
}

// 创建并运行ELECTRON应用程序
app.whenReady().then(() => {
    const auth = new UserAuthentication();
    auth.showLoginWindow().then((result) => {
        if (result) {
            console.log('用户登录成功');
            // 创建主窗口等后续操作
        } else {
            console.log('用户登录失败');
        }
    });
});

// 退出应用程序时关闭所有窗口
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
