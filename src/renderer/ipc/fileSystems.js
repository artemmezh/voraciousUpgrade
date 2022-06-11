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

export const isDirectory = async (...args) => {
  return window.electron.ipcRenderer.invoke('isDirectory', args)
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
  return "0.3"; //window.electron.ipcRenderer.invoke('getVersion', args) //dont know why version does not return
}
