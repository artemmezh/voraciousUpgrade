export const extractAudio = async (...args) => {
  return window.electron.ipcRenderer.invoke('extractAudio', args);
}

export const extractFrameImage = async (...args) => {
  return window.electron.ipcRenderer.invoke('extractFrameImage', args);
}
