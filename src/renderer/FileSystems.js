//fs
export const readdir = async (path) => {
  return window.electron.ipcRenderer.invoke('readdir', [path]);
}

export const exists = async (path) => {
  return window.electron.ipcRenderer.invoke('exists', [path]);
}

export const readFile = async (path) => {
  return window.electron.ipcRenderer.invoke('readFile', [path]);
}

export const endsWith = async (...args) => {
  return window.electron.ipcRenderer.invoke('endsWith', args)
}

//path
export const join = async (...args) => {
  console.log("join args")
  console.log(args)
  const r = window.electron.ipcRenderer.invoke('join', args)
  console.log("r");
  console.log(r);
  return r;
}

export const stat = async (...args) => {
  return window.electron.ipcRenderer.invoke('stat', args)
}

export const extname = async (...args) => {
  return window.electron.ipcRenderer.invoke('extname', args)
}

export const basename = async (...args) => {
  return window.electron.ipcRenderer.invoke('basename', args)
}

//app
export const getAppPath = async (...args) => {
  return window.electron.ipcRenderer.invoke('getAppPath', args)
}

export const getPath = async (...args) => {
  return window.electron.ipcRenderer.invoke('getPath', args)
}

export const getVersion = async (...args) => {
  return window.electron.ipcRenderer.invoke('getVersion', args)
}
