import ipcFfmpegHandlers from "./ipcMainFfmpeg";
import ipcDatabaseHandlers from "./ipcDatabase";
import ipcFileSystemHandlers from "./ipcFileSystem"
import ipcPathHandlers from "./ipcPath";
import ipcAppHandlers from "./ipcApp";
import ipcDialogHandlers from "./ipcDialog";

export default function initApplicationHandlers() {
  ipcFfmpegHandlers();
  ipcDatabaseHandlers();
  ipcFileSystemHandlers();
  ipcPathHandlers();
  ipcAppHandlers();
  ipcDialogHandlers();
}
