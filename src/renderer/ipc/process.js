export const getProcessPlatform = async (...args) => {
  return window.electron.ipcRenderer.invoke('processPlatform', args)
}
