import {ipcMain} from "electron";


export default function ipcProcessHandlers() {
  ipcMain.handle('processPlatform', async (event, args) => {
    return process.platform;
  })
}
