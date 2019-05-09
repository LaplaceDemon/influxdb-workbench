const {app, BrowserWindow} = require('electron');
const {Menu} = require('electron');
const ipc = require('electron').ipcMain;

const path = require('path');
const url = require('url');


function createWindow () {
    // 隐藏菜单
    // Menu.setApplicationMenu(null);
    // 创建浏览器窗口
    win = new BrowserWindow({width:300, height:400, webPreferences: {
        nodeIntegration: true   // 打开这个选项，否则在页面级的js无法使用require()函数。
      }})
    // 然后加载应用的 index.html
    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file:'
    }))

    // win.loadURL("index.html");
    // win.setAlwaysOnTop(true);
    win.webContents.openDevTools();
}

app.on('ready', createWindow);

ipc.on('openInfluxdb',function() {
    // Menu.setApplicationMenu(true);
    var newwin = new BrowserWindow({
        width: 600, 
        height: 400,
        frame:true,
        parent: win, //win是主窗口
        webPreferences: {
            nodeIntegration: true   // 打开这个选项，否则在页面级的js无法使用require()函数。
        }
    })
    newwin.loadURL(path.join('file:',__dirname,'influxdb-work.html')); //new.html是新开窗口的渲染进程
    // newwin.loadURL("influxdb-work.html");
    newwin.on('closed',()=>{newwin = null})
})
