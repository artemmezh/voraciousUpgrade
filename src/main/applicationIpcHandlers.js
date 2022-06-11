import ipcFfmpegHandlers from "./ipcMainFfmpeg";
import ipcDatabaseHandlers from "./ipcDatabase";
import ipcFileSystemHandlers from "./ipcFileSystem"
import ipcPathHandlers from "./ipcPath";
import ipcAppHandlers from "./ipcApp";

export default function initApplicationHandlers() {
  ipcFfmpegHandlers();
  ipcDatabaseHandlers();
  ipcFileSystemHandlers();
  ipcPathHandlers();
  ipcAppHandlers();
}
