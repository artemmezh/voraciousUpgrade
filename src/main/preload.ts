import {contextBridge, ipcRenderer, IpcRendererEvent, shell, app} from 'electron';

export type Channels =
  'sqlite' | 'sqliteGetItemMaybe' | 'sqliteSetItem' | 'readdir' | 'exists' |
  'extname' | 'join' | 'readFile' | 'parse' | 'ensureDir' | 'stat' | 'basename' | 'getAppPath' |
  'getPath' | 'endsWith' | 'getVersion' | 'getWordMaybe' | 'setWord' | 'getAllWords' | 'setItem'|
  'choose-directory' | 'chose-directory' | 'isDirectory' | 'turnOffFullScreen' | 'toggleFullscreen' |
  'extractAudio' | 'extractFrameImage' | 'initDb';
export type sqlite3 = 'sqlite3'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
      console.log()
      ipcRenderer.on(channel, listener);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, args: unknown[]): Promise<object> {
      return ipcRenderer.invoke(channel, args);
    },
    removeListener(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.removeListener(channel, subscription);
    }
  },
  shell: shell,
  remote: app,
  sqlite3: { // why it does not work while ipcRender works?
    invoke(channel: string): Promise<object> {
      return ipcRenderer.invoke('my-invokable-ipc');
    }
  }
});
