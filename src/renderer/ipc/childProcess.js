export const execFile = async (...args) => {
  return window.electron.ipcRenderer.invoke('execFile', args)
}
