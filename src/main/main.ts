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
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {ElectronSqliteBackend} from './ElectronSqliteBackend.js';
import { open } from 'sqlite'
const fs = require("fs-extra");

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

export const getUserDataPath = () => {
  return app.getPath('userData');
};
const userDataPath = getUserDataPath();
const dbFilename = path.join(userDataPath, 'voracious.db');
const sqlite3 = require("sqlite3").verbose();
const electronSqliteBackend = new ElectronSqliteBackend();


ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// TODO dont worry it will be refactoring
//===============
// Database
//==============
ipcMain.on('sqlite', (event, arg) => {
  console.log(arg);
  // console.log(db);
  event.reply('asynchronous-reply', ["qwe", "qwe"]);
});

ipcMain.handle('sqlite', async (event, args) => {
  const result = ["qwe","asd"];
  console.log(result);
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })

  return dbInitialized;
})

//sql

ipcMain.handle('sqliteGetItemMaybe', async (event, args) => {
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
  console.log(dbInitialized)
  return electronSqliteBackend.getItemMaybe(args[0], dbInitialized)
})

ipcMain.handle('sqliteSetItem', async (event, args) => {
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
  return electronSqliteBackend.setItem(args[0], args[1], dbInitialized)
})

ipcMain.handle('setWord', async (event, args) => {
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
  return electronSqliteBackend.setWord(args[0], args[1], dbInitialized)
})

ipcMain.handle('getAllWords', async (event, args) => {
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
  return electronSqliteBackend.getAllWords(dbInitialized)
})

ipcMain.handle('setItem', async (event, args) => {
  const dbInitialized = await open({
    filename: dbFilename,
    driver: sqlite3.Database
  })
  return electronSqliteBackend.setItem(args[0], args[1], dbInitialized)
})

//===============
// fs
//==============

ipcMain.handle('readdir', async (event, args) => {
  return fs.readdir(args[0]);
})

ipcMain.handle('exists', async (event, args) => {
  return fs.exists(args[0]);
})

ipcMain.handle('readFile', async (event, args) => {
  return fs.readFile(args[0]);
})

ipcMain.handle('ensureDir', async (event, args) => {
  return fs.ensureDir(args[0]);
})

ipcMain.handle('stat', async (event, args) => {
  return fs.stat(args[0]);
})

ipcMain.handle('endsWith', async (event, args) => {
  return fs.endsWith(args[0]);
})

ipcMain.handle('isDirectory', async (event, args) => {
  return fs.stat(args[0]).isDirectory
})

//===============
// path
//==============

ipcMain.handle('extname', async (event, args) => {
  return path.extname(args[0]);
})

ipcMain.handle('join', async (event, args) => {
  console.log("args")
  console.log(args)
  const joinResult = path.join(...args);
  console.log(joinResult)
  return joinResult;
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

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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
    console.log('choose vido file')
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
    console.log(prompt)
    console.log('opening dialog choose-directory')
    dialog.showOpenDialog({
      title: prompt,
      buttonLabel: 'Choose',
      properties: ['openDirectory'],
    }).then( files => {
      console.log('files')
      console.log(files)
      const filePaths = files.filePaths
      if (filePaths && filePaths.length) {
        const dir = filePaths[0];
        console.log(dir)
        const basename = path.basename(dir);
        console.log("basename->>>>")
        console.log(basename)
        mainWindow.send('chose-directory', basename, dir)
      }
    });
  });

  ipcMain.on('open-devtools', () => {
    mainWindow.webContents.openDevTools();
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
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

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
    return { action: 'deny' };
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
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
