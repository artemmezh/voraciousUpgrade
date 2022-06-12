import { getBinariesPath, getUserDataPath } from '../util/appPaths';
import {getProcessPlatform} from "../ipc/process";
import {join, getParsedName} from "../ipc/path";
import {ensureDir, exists} from "../ipc/fileSystems";
import {execFile} from "../ipc/childProcess";

export const importEpwing = async (epwingDir) => {
  const binariesPath = await getBinariesPath();
  const yomichanImportDir = await join(binariesPath, 'yomichan-import');
  let yomichanImport = await join(yomichanImportDir, 'yomichan-import');
  const platform = await getProcessPlatform();

  if (platform.toString() === 'win32') {
    yomichanImport += '.exe';
  }

  // Make destination filename based on src, that doesn't conflict
  // TODO: ensure that epwingDir is a directory?
  const srcBase =  await getParsedName(epwingDir);
  const userDataPath = await getUserDataPath();
  const destDir = await join(userDataPath, 'dictionaries');
  await ensureDir('ensureDir', [destDir]);

  let idx = 0;
  let destFn;
  while (true) {
    destFn = await join(destDir, srcBase);
    if (idx) {
      destFn += idx.toString();
    }
    destFn += '.zip';

    if (!(await exists(destFn))) {
      break;
    }
    idx++;
  }

  console.log('importEpwing', yomichanImport, epwingDir, destFn);
  return execFile(yomichanImport, [epwingDir, destFn], {cwd: yomichanImportDir, windowsHide: true});
};
