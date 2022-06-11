import {app, ipcMain} from "electron";
import {ElectronSqliteBackend} from "./ElectronSqliteBackend";
import path from "path";
import {open} from 'sqlite'


export default function ipcDatabaseHandlers() {
  const electronSqliteBackend = new ElectronSqliteBackend();
  const userDataPath = app.getPath('userData');
  const dbFilename = path.join(userDataPath, 'voracious.db');
  const sqlite3 = require("sqlite3").verbose();

  ipcMain.handle('initDb', async (event, args) => {
    const dbInitialized = await open({
      filename: dbFilename,
      driver: sqlite3.Database
    })
    await electronSqliteBackend.initialize(dbInitialized)
    return;
  })

  ipcMain.handle('sqliteGetItemMaybe', async (event, args) => {
    const dbInitialized = await open({
      filename: dbFilename,
      driver: sqlite3.Database
    })
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
}
