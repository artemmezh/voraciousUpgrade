export const join = async (...args) => {
  return window.electron.ipcRenderer.invoke('join', args)
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
