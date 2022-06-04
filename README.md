#Log
There was my log about upgrading process for electron to latest version.    
I am not fronted developer. I dont have experience in js or typescript or electron, but i want to create modern desktop application for learning language. So, here my log about knowledge which i get during upgrading application `voracious`.

My plan is copy and past chunk of code from main repository :) 

## Day 0
* It is bad practice to use native nodejs moduler in render process, so you should choose ipcRender instead
* remote module of electron is deprecated
* alias for types it is cool feature of typesctipe. For example `type Channel = 'channel-1' | 'channel-2''`
* more about invoke methods here https://github.com/electron/electron/issues/21408#issuecomment-564184702 or here https://stackoverflow.com/questions/69070320/how-to-get-the-current-browser-window-in-the-renderer-in-electron-14
* IPC (inter-process communication)
* modern guide about electron and ipc https://www.debugandrelease.com/the-ultimate-electron-guide/
