import {ipcMain} from "electron";
import {extractAudio, extractFrameImage} from "../ffmpeg";


export default function ipcFfmpegHandlers() {
  ipcMain.handle('extractAudio', async (event, args) => {
    const vidfn = args[0];
    const startTime = args[1];
    const endTime = args[2];
    return extractAudio(vidfn, startTime, endTime);
  })

  ipcMain.handle('extractFrameImage', async (event, args) => {
    const vidfn = args[0];
    const time = args[1];
    return extractFrameImage(vidfn, time);
  })
}
