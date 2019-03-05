const { app, BrowserWindow } = require('electron');
const path = require('path');

require('electron-debug')();
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 700, height: 500, resizable: true});
    mainWindow.loadFile(path.join(__dirname, 'assets/index.html'));
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
