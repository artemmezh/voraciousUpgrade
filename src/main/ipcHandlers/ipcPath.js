import {ipcMain} from "electron";
import path from "path";


export default function ipcPathHandlers() {
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
}
