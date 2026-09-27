const socket = new WebSocket('ws://localhost:8080')

const DISPLAY_WIDTH = 600
const DISPLAY_HEIGHT = 460
const GAME_HEIGHT = 400
const HUD_HEIGHT = 60

let queueStartTime = Date.now()

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function setupCanvasForHiDPI() {
  const dpr = window.devicePixelRatio || 1

  canvas.width = DISPLAY_WIDTH * dpr
  canvas.height = DISPLAY_HEIGHT * dpr
  canvas.style.width = DISPLAY_WIDTH + 'px'
  canvas.style.height = DISPLAY_HEIGHT + 'px'

  ctx.scale(dpr, dpr)
  ctx.textAlign = 'center'   // moved here, so it survives the reset
}

setupCanvasForHiDPI()

let you = null
let others = []

let projectiles = []

let gameState = 'QUEUED'
let winner = null
let maxPlayers = 0
let countdownRemaining = 0

function drawYourHud(you) {
  const barX = 20
  const barY = GAME_HEIGHT + 20
  const barWidth = 200
  const barHeight = 20

  ctx.fillStyle = '#333'
  ctx.fillRect(barX, barY, barWidth, barHeight)

  const pct = Math.max(you.health, 0) / you.maxHealth
  ctx.fillStyle = pct > 0.3 ? '#4caf50' : '#e53935'
  ctx.fillRect(barX, barY, barWidth * pct, barHeight)

  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(barX + barWidth + 20 + i * 20, barY + barHeight / 2, 6, 0, Math.PI * 2)
    ctx.fillStyle = i < you.lives ? you.color : '#333'
    ctx.fill()
  }
}

// function to move
const loop = () => {
  // draw circle and clear old circle after new position is calculated so old frame isn't there
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  const bgGradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)
  bgGradient.addColorStop(0, '#1a1a2e')
  bgGradient.addColorStop(1, '#0f0f1a')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, canvas.width, GAME_HEIGHT)

  ctx.fillStyle = '#000'
  ctx.fillRect(0, GAME_HEIGHT, canvas.width, HUD_HEIGHT)

  others.forEach((player) => {
    // placeholder for dead players
    if (gameState === 'IN_PROGRESS' && player.isDead === false && player.isEliminated === false) {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = '16px "VT323"'
    ctx.fillText(player.name, player.x, player.y - 20)
    }
  })

  if (you && gameState === 'IN_PROGRESS' && you.isDead === false && you.isEliminated === false) {
    ctx.fillStyle = you.color;
    ctx.beginPath();
    ctx.arc(you.x, you.y, 15, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = '16px "VT323"'
    ctx.fillText(you.name, you.x, you.y - 20)
  }

  if (you && gameState === 'IN_PROGRESS') {
  
    drawYourHud(you)
  }

  if (gameState === 'QUEUED') {
    // compute seconds waited from queueStartTime, draw text
    const secondsWaited = ((Date.now() - queueStartTime) / 1000)
    ctx.fillStyle = 'white'
    ctx.font = '40px "VT323"'
    ctx.fillText(`Waiting for a room... ${Math.floor(secondsWaited)} seconds`, DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2)
}

  if (gameState === 'FINISHED' && winner) {
    ctx.fillStyle = 'white'
    ctx.font = '40px "VT323"' // you'll probably want a bigger font just for this
    ctx.fillText(`${winner.name} wins!`, DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2)
}
  if (gameState === 'WAITING') {
    ctx.fillStyle = 'white'
    ctx.font = '40px "VT323"'
    ctx.fillText("Waiting for players to join...", DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2)
    ctx.fillText(`${others.length + 1} / ${maxPlayers}...`, DISPLAY_WIDTH / 2 + 30, DISPLAY_HEIGHT / 2 + 30)
}

if (gameState === 'COUNTDOWN') {
    ctx.fillStyle = 'white'
    ctx.font = '40px "VT323"'
    ctx.fillText(`Starting in ${Math.ceil(countdownRemaining)}...`, DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2)
}
  
  projectiles.forEach((projectile) => {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2)
    ctx.fill()

  })

  // call loop again regardless
  requestAnimationFrame(loop)

  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    you = data.you
    others = data.others
    projectiles = data.projectiles
    gameState = data.state
    winner = data.winner
    countdownRemaining = data.countdownRemaining
    maxPlayers = data.maxPlayers
  }


window.addEventListener('keydown', (event) => {
  if ("wasd".includes(event.key.toLowerCase())) {
    console.log('movement key pressed')
    socket.send(JSON.stringify({type: 'keydown', key: event.key}))
  }
})

window.addEventListener('keyup', (event) => {
  if ("wasd".includes(event.key.toLowerCase())) {
    console.log('movement key released')
    socket.send(JSON.stringify({type: 'keyup', key: event.key}))
  }
  
})

window.addEventListener('mousemove', (event) => {
  let rect = canvas.getBoundingClientRect()
  let clientX = event.clientX - rect.left
  let clientY = event.clientY - rect.top

  socket.send(JSON.stringify({type: 'mousemove', x:clientX, y:clientY}))
})

window.addEventListener('click', (event) => {
  socket.send(JSON.stringify({type: 'click'}))
})

Promise.all([
  document.fonts.load('20px "Press Start 2P"'),
  document.fonts.load('16px "VT323"')
]).then(() => {
  loop()
})
