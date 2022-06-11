import ipcFfmpegHandlers from "./ipcMainFfmpeg";
import ipcDatabaseHandlers from "./ipcDatabase";
import ipcFileSystemHandlers from "./ipcFileSystem"

export default function initApplicationHandlers() {
  ipcFfmpegHandlers();
  ipcDatabaseHandlers();
  ipcFileSystemHandlers();
}
