export const turnOffFullScreen  = async () => {
  window.electron.ipcRenderer.sendMessage('turnOffFullScreen', 'turnOffFullScreen');
}
export const toggleFullscreen  = async () => {
  window.electron.ipcRenderer.sendMessage('toggleFullscreen', 'toggleFullscreen');
}

export const choseVideoFile = async (listener) => {
  window.electron.ipcRenderer.on('chose-video-file', listener);
}

export const removeListenerChoseVideoFile = async (listener) => {
  window.electron.ipcRenderer.removeListener('chose-video-file', listener);
}

export const sendChoseVideoFile = async () => {
  window.electron.ipcRenderer.sendMessage('chose-video-file');
}
