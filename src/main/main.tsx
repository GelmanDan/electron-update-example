import {app, BrowserWindow, dialog, Tray, Menu, nativeImage, autoUpdater} from 'electron';
// const { autoUpdater } = require("electron-updater");
// require('update-electron-app')();
// var squirrel = require('squirrel');
const { autoUpdater } = require("electron-updater");

const log = require('electron-log');
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
const db = require('electron-db');
const fs = require('fs');

const path = require("path");

const VERSION = "2020.12.01.1";

let win

const dispatch = (data) => {
    win.webContents.send('message', data)
}

//AutoUpdate app
// autoUpdater.setFeedURL(updateFeed + '?v=' + '1.0.0');
// autoUpdater.checkForUpdates();
// autoUpdater.on('error', function(err: Error){
//     console.error(err);
// });
// autoUpdater.on('checking-for-update', ()=>{
//     console.info('Checking for update');
// });
// autoUpdater.on('update-available', ()=>{
//     console.log('Update is available');
// });
// autoUpdater.on('update-not-available', ()=>{
//     console.log('Update is not available');
// });
// autoUpdater.on('update-downloaded', (response)=>{
//     console.log('Update downloaded!');
// });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

// Log both at dev console and at running node console instance
function logEverywhere(s: any) {
    console.log(s);
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
    }
}

const createWindow = () => {
    // Create the browser window.
    const icon = path.join(__dirname, 'favicon.ico');

    mainWindow = new BrowserWindow({
        height: 850,
        width: 900,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
        transparent: false,
        icon: icon
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // mainWindow = null;
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // mainWindow.loadURL('http://localhost:5000/');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Protocol handler for win32
    if (process.platform == 'win32') {
        // Keep only command line / deep linked arguments
    }

    mainWindow.setMenu(null);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.on('ready', function () {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

if (!app.isDefaultProtocolClient('faceIdServer')) {
    // Define custom protocol handler. Deep linking works on packaged versions of the application!
    app.setAsDefaultProtocolClient('faceIdServer')
}

app.on('will-finish-launching', function () {
    // Protocol handler for osx
    // app.on('open-url', function (event, url) {
    //     event.preventDefault();
    //     deepLinkingUrl = url;
    //     logEverywhere('open-url# ' + deepLinkingUrl)
    // })
});

autoUpdater.on('checking-for-update', () => {
    dispatch('Checking for update...')
});

autoUpdater.on('update-available', (info) => {
    dispatch('Update available.')
    logEverywhere('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
    dispatch('Update not available.')
    logEverywhere('Update not available.');
});

autoUpdater.on('error', (err) => {
    dispatch('Error in auto-updater. ' + err)
    logEverywhere('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    // let log_message = "Download speed: " + progressObj.bytesPerSecond
    // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    // dispatch(log_message)

    win.webContents.send('download-progress', progressObj.percent)

});

autoUpdater.on('update-downloaded', (info) => {
    dispatch('Update downloaded')
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.