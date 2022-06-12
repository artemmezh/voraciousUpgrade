import {ipcMain} from "electron";
const { execFile } = require('child_process');

export default function ipcChildProcessHandlers() {
  ipcMain.handle('execFile', async (event, args) => {
    // const yomichanImport = args[0];
    // const epwingDir = args[1];
    // const destFn = args[2];
    // const yomichanImportDir = args[3];

    execFile(args[0], args[1], args[2]);
    return;
  })
}
