const { app, BrowserWindow, ipcMain } = require('electron')
const robot = require('@jitsi/robotjs')
const path = require('path')

let mainWindow

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL('http://localhost:5173')
})

ipcMain.on('move-mouse', (event, { x, y }) => {
  robot.moveMouse(x, y)
})

ipcMain.on('click-mouse', () => {
  robot.mouseClick('left')
})

ipcMain.on('right-click', () => {
  robot.mouseClick('right')
})

ipcMain.on('scroll', (event, { direction }) => {
  if (direction === 'up') robot.scrollMouse(0, 3)
  else robot.scrollMouse(0, -3)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})