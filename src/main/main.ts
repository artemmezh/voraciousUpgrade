/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {app, BrowserWindow, shell, ipcMain, dialog} from 'electron';
import {autoUpdater} from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {resolveHtmlPath} from './util';
import initApplicationHandlers from "./applicationIpcHandlers";

const {protocol} = require('electron');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// TODO dont worry it will be refactored

//===============
// path
//==============

ipcMain.handle('extname', async (event, args) => {
  return path.extname(args[0]);
})

ipcMain.handle('join', async (event, args) => {
  return path.join(...args);
})

ipcMain.handle('parse', async (event, args) => {
  return path.parse(args[0]);
})

ipcMain.handle('basename', async (event, args) => {
  return path.basename(args[0], args[1]);
})

//===============
// app
//==============

ipcMain.handle('getAppPath', async (event, args) => {
  return app.getAppPath();
})

ipcMain.handle('getPath', async (event, args) => {
  return app.getPath(args[0]);
})

ipcMain.handle('getVersion', async (event, args) => {
  return app.getVersion();
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true
 // process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

function addIpcHandlers() {
  ipcMain.on('choose-video-file', () => {
    dialog.showOpenDialog({
      title: 'Choose a video file',
      buttonLabel: 'Choose',
      filters: [{name: 'Videos', extensions: ['mp4', 'webm']}],
      properties: ['openFile'],
    }, files => {
      if (files && files.length) {
        const fn = files[0];
        mainWindow.send('chose-video-file', fn)
      }
    });
  });

  ipcMain.on('choose-directory', (event, prompt) => {
    dialog.showOpenDialog({
      title: prompt,
      buttonLabel: 'Choose',
      properties: ['openDirectory'],
    }).then(files => {
      const filePaths = files.filePaths
      if (filePaths && filePaths.length) {
        const dir = filePaths[0];
        const basename = path.basename(dir);
        mainWindow.send('chose-directory', basename, dir)
      }
    });
  });

  ipcMain.on('open-devtools', () => {
    mainWindow.webContents.openDevTools();
  });

  ipcMain.on('turnOffFullScreen', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  ipcMain.on('toggleFullscreen', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      // webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(resolveHtmlPath('index.html'));

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
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return {action: 'deny'};
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    addIpcHandlers();
    initApplicationHandlers();
    createWindow();
    protocol.registerFileProtocol("local-video", (req, callback) => {
      const url = req.url.replace("local-video://", "");
      const decodedUrl = decodeURI(url); // in case URL contains spaces
      try {
        return callback(decodedUrl);
      } catch (err) {
        log.error('Invalid video file selected:', err);
        return callback(404);
      }
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
