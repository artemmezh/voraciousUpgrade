export const getAppPath = async (...args) => {
  return window.electron.ipcRenderer.invoke('getAppPath', args)
}

export const getPath = async (...args) => {
  return window.electron.ipcRenderer.invoke('getPath', args)
}

export const getVersion = async (...args) => {
  return "0.3"; //window.electron.ipcRenderer.invoke('getVersion', args) //dont know why version does not return
}
