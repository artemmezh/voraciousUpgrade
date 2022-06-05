export class Storage {
  async getItemMaybe(...args) {
    return window.electron.ipcRenderer.invoke('sqliteGetItemMaybe', args)
  }

  async getWordMaybe(...args) {
    return window.electron.ipcRenderer.invoke('getWordMaybe', args)
  }

  async getAllWords(...args) {
    return window.electron.ipcRenderer.invoke('getAllWords', args)
  }

  async setItem(...args) {
    return window.electron.ipcRenderer.invoke('setItem', args)
  }

  async setWord(...args) {
    return window.electron.ipcRenderer.invoke('setWord', args)
  }
}
