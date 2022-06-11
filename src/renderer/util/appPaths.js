import {join} from "../ipc/path";
import {getAppPath, getPath} from "../ipc/app"

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
  return await join(appPath, 'resources', 'bin', process.platform);
};
