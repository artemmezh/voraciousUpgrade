import {app, ipcMain} from "electron";

export default function ipcAppHandlers() {
  ipcMain.handle('getAppPath', async (event, args) => {
    return app.getAppPath();
  })

  ipcMain.handle('getPath', async (event, args) => {
    return app.getPath(args[0]);
  })

  ipcMain.handle('getVersion', async (event, args) => {
    return app.getVersion();
  })
}
