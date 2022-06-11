export const turnOffFullScreen  = async () => {
  window.electron.ipcRenderer.sendMessage('turnOffFullScreen', 'turnOffFullScreen')
}
export const toggleFullscreen  = async () => {
  window.electron.ipcRenderer.sendMessage('toggleFullscreen', 'toggleFullscreen')
}

