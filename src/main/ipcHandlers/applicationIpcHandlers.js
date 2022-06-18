import ipcFfmpegHandlers from "./ipcMainFfmpeg";
import ipcDatabaseHandlers from "./ipcDatabase";
import ipcFileSystemHandlers from "./ipcFileSystem"
import ipcPathHandlers from "./ipcPath";
import ipcAppHandlers from "./ipcApp";
import ipcDialogHandlers from "./ipcDialog";
import ipcProcessHandlers from "./ipcProcess";
import ipcChildProcessHandlers from "./ipcChildProcess";

export default function initApplicationHandlers(mainWindow) {
  ipcFfmpegHandlers();
  ipcDatabaseHandlers();
  ipcFileSystemHandlers();
  ipcPathHandlers();
  ipcAppHandlers();
  ipcProcessHandlers();
  ipcChildProcessHandlers();
  // ipcDialogHandlers(mainWindow); //todo I don`t know how to init mainWindow in function
}
