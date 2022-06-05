import {Channels} from 'main/preload';

declare global {
  import IpcRendererEvent = Electron.IpcRendererEvent;

  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: string, args: unknown[]): Promise<object>
        removeListener(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
      },
      shell: Electron.Shell,
      remote: Electron.App
      ;
    };
  }
}

export {};
