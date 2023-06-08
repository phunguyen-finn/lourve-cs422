// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'prompt-detected' | 'hotword-detected' | 'silent-prompt-detected';

const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (_event: IpcRendererEvent, ...args: unknown[]) => void) {
      ipcRenderer.on(channel, func);
      return () => {
        ipcRenderer.removeListener(channel, func);
      };
    }
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
