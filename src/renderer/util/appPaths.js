import {getAppPath, getPath} from "../ipc/fileSystems";
import {join} from "../ipc/path";

export const getUserDataPath = async () => {
  return await getPath('userData');
};

export const getResourcesPath = async () => {
  const appPath = await getAppPath();
  return await join(appPath, 'resources');
};

export const getBinariesPath = async () => {
  let appPath = await getAppPath();
  if (appPath.endsWith('.asar')) { //todo испрвить
    appPath += '.unpacked';
  }
  return await join(appPath, 'resources', 'bin', process.platform);
};
