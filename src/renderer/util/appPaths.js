// import path from 'path';

import {getAppPath, getPath} from "../FileSystems";
import {join} from "../FileSystems";
// const { path } = window.require('electron').remote;
// const app = window.electron.remote;

export const getUserDataPath = () => {
  const userData = getPath('userData');
  console.log(userData);
  return userData;
};

export const getResourcesPath = async () => {
  const appPath = await getAppPath();
  console.log("appPath")
  console.log(appPath)
  const path = await join(appPath, 'resources');
  console.log("path from getResourcesPath:");
  console.log(path);
  return path;
};

export const getBinariesPath = () => {
  let appPath = getAppPath();
  if (appPath.endsWith('.asar')) { //todo испрвить
    appPath += '.unpacked';
  }
  return await join(appPath, 'resources', 'bin', process.platform);
};
