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

export const ensureDir = async (...args) => {
  return window.electron.ipcRenderer.invoke('ensureDir', args)
}

export const unlink = async (...args) => {
  return window.electron.ipcRenderer.invoke('unlink', args)
}
