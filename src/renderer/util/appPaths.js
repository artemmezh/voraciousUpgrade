import {join} from "../ipc/path";
import {getAppPath, getPath} from "../ipc/app"
import {getProcessPlatform} from "../ipc/process";

export const getUserDataPath = async () => {
  return await getPath('userData');
};

export const getResourcesPath = async () => {
  const appPath = await getAppPath();
  return await join(appPath, 'resources');
};

export const getBinariesPath = async () => {
  let appPath = await getAppPath();
  if (appPath.endsWith('.asar')) {
    appPath += '.unpacked';
  }
  const processPlatform = await getProcessPlatform();
  return await join(appPath, 'resources', 'bin', processPlatform);
};
