class PathCustom {
  async join(...args) {
    return  window.electron.ipcRenderer.invoke('join', args)
  }

  async stat(...args){
    return window.electron.ipcRenderer.invoke('stat', args)
  }

  async extname(...args) {
    return window.electron.ipcRenderer.invoke('extname', args)
  }

  async basename(...args) {
    return window.electron.ipcRenderer.invoke('basename', args)
  }
}

export default new PathCustom()
