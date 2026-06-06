const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  moveMouse: (x, y) => ipcRenderer.send('move-mouse', { x, y }),
  clickMouse: () => ipcRenderer.send('click-mouse'),
  rightClick: () => ipcRenderer.send('right-click'),
  scroll: (direction) => ipcRenderer.send('scroll', { direction })
})