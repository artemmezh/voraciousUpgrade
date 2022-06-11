import { getBinariesPath, getUserDataPath } from '../util/appPaths';

export const importEpwing = async (epwingDir) => {
  const binariesPath = await getBinariesPath();
  const yomichanImportDir = join(binariesPath, 'yomichan-import');
  let yomichanImport = join(yomichanImportDir, 'yomichan-import');
  //todo create supplier for plaform
  // if (process.platform === 'win32') {
  //   yomichanImport += '.exe';
  // }

  // Make destination filename based on src, that doesn't conflict
  // TODO: ensure that epwingDir is a directory?
  const srcBase =  window.electron.ipcRenderer.invoke('parse', [epwingDir]).name;
  const userDataPath = await getUserDataPath();
  const destDir = join(userDataPath, 'dictionaries');
  await window.electron.ipcRenderer.invoke('ensureDir', [destDir]);

  let idx = 0;
  let destFn;
  while (true) {
    destFn = join(destDir, srcBase);
    if (idx) {
      destFn += idx.toString();
    }
    destFn += '.zip';

    if (!(await window.electron.ipcRenderer.invoke('exists', [destFn]))) {
      break;
    }
    idx++;
  }

  console.log('importEpwing', yomichanImport, epwingDir, destFn);
  return new Promise((resolve, reject) => {
    execFile(yomichanImport, [epwingDir, destFn], {cwd: yomichanImportDir, windowsHide: true}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(destFn);
    });
  });
};

const join = async (...args) => {
  await window.electron.ipcRenderer.invoke('join', args)
}
