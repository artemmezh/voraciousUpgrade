import {ipcMain} from "electron";
import fs from "fs-extra";

export default function ipcFileSystemHandlers() {
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
}
