'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const robot = require('@jitsi/robotjs')
const path = require('path')

app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-dev-shm-usage')
app.commandLine.appendSwitch('disable-setuid-sandbox')

app.commandLine.appendSwitch('enable-usermedia-screen-capturing')  // ← हे add कर
app.commandLine.appendSwitch('allow-file-access-from-files')  // ← हे add 

let mainWindow

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      sandbox: false,  
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

   mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === 'media') {
        callback(true)  // Allow camera!
      } else {
        callback(false)
      }
    }
  )

  mainWindow.loadURL('http://localhost:5174')
  mainWindow.webContents.openDevTools()
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