import path from 'path';

// const { path } = window.require('electron').remote;
const app = window.electron.remote;

export const getUserDataPath = () => {
  const userData =  app.getPath('userData');
  console.log(userData);
  return userData;
};

export const getResourcesPath = () => {
  return path.join(app.getAppPath(), 'resources');
};

export const getBinariesPath = () => {
  let appPath = app.getAppPath();
  if (appPath.endsWith('.asar')) {
    appPath += '.unpacked';
  }
  return path.join(appPath, 'resources', 'bin', process.platform);
};
