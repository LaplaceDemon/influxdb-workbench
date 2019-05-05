const {app, BrowserWindow} = require('electron')
const path = require('path');
const url = require('url');

function createWindow () {
    // 创建浏览器窗口
    win = new BrowserWindow({width: 800, height: 600, webPreferences: {
        nodeIntegration: true   // 打开这个选项，否则在页面级的js无法使用require()函数。
      }})
    // 然后加载应用的 index.html
    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file:'
    }))

    win.loadURL("index.html");
    win.webContents.openDevTools();
}

app.on('ready', createWindow)