const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const robot = require('@jitsi/robotjs')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" }
})

io.on('connection', (socket) => {
  console.log('React connected!')

  socket.on('move-mouse', ({ x, y }) => {
    const flippedX = 1366 - x
    console.log(`Moving to X: ${x} Y: ${y}`) 
     robot.moveMouse(1366 - x, y) 
  })

  socket.on('click-mouse', () => {
    robot.mouseClick('left')
  })

  socket.on('right-click', () => {
  robot.mouseClick('right')
})

socket.on('mouse-down', ({ x, y }) => {
  robot.moveMouse(x, y)
  robot.mouseToggle('down', 'left')
})

socket.on('mouse-up', () => {
  robot.mouseToggle('up', 'left')
})

  socket.on('scroll', ({ direction }) => {
    if (direction === 'up') robot.scrollMouse(0, 3)
    else robot.scrollMouse(0, -3)
  })

  socket.on('disconnect', () => {
    console.log('React disconnected')
  })
})

server.listen(3001, () => {
  console.log('Mouse server running on port 3001')
})