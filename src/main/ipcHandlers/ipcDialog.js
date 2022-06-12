import {dialog, ipcMain} from "electron";
import path from "path";


export default function ipcDialogHandlers(mainWindow) {
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
