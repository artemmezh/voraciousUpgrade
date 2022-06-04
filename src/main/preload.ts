import { contextBridge, ipcRenderer, IpcRendererEvent, shell, app } from 'electron';

export type Channels = 'ipc-example' | 'sqlite' | 'sqliteGetItemMaybe' | 'sqliteSetItem';
export type sqlite3 = 'sqlite3'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, args: unknown[]): Promise<object> {
      return ipcRenderer.invoke(channel, args);
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
