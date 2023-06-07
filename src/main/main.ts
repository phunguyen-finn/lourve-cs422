/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'dotenv/config'
import { app, BrowserWindow, shell, ipcMain, Tray, Menu, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { spawn } from 'child_process';
import { resolveHtmlPath } from './util';
import path from 'path';
import { Howl } from 'howler';
import fs from 'fs';
import player from 'sound-play';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const SOURCE_PATH = app.isPackaged
? path.join(process.resourcesPath)
: path.join(__dirname, '../../');

var sleepSound = new Howl({
  src: [path.join(SOURCE_PATH, 'assets', 'sleep.mp3')]
});

const child = spawn('node', [path.join(SOURCE_PATH, 'src', 'main', 'background-listener', 'index.js')]);

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

child.stdout.on('data', (data) => {
  switch (data.toString()) {
    case 'hotword-detected':
      createWindow();
      break;
    case 'silent-prompt-detected':
      mainWindow?.close();
      break;
    default:
      mainWindow?.webContents.send('prompt-detected', { uint8Array: Uint8Array.from(data) });
      break;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const createWindow = async () => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    width: 300,
    height: 180,
    x: width - 300 - 100,
    y: height - 210 - 100,
    frame: false,
    alwaysOnTop: true,
    maximizable: false,
    icon: path.join(SOURCE_PATH, "assets", "icon.png"),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.webContents.openDevTools({
    mode: 'detach',
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    child.stdin.write('stop-prompt-detecting');
    child.stdin.write('stop-hotword-detecting');
    child.stdin.write('start-hotword-detecting');
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  mainWindow.on("show", () => {
    mainWindow?.webContents.send('hotword-detected');
  })

  child.stdin.write('stop-hotword-detecting');
  child.stdin.write('start-prompt-detecting');
};

const createTray = async () => {
  tray = new Tray(path.join(SOURCE_PATH, "assets", "icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Ask', click: () => console.log('Clicked Ask') },
    { label: 'Settings', click: () => console.log('Clicked Settings') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.on('click', () => {
    createWindow();
  });
  tray.setToolTip('Doraemon is here to help you!');
  tray.setContextMenu(contextMenu);
};

// app.on('window-all-closed', () => {
//   // Respect the OSX convention of having the application in memory even
//   // after all windows have been closed
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on("window-all-closed", (e: any) => {
  e.preventDefault();
});

app
  .whenReady()
  .then(() => {
    createTray();
    child.stdin.write('start-hotword-detecting');
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
