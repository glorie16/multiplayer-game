const socket = new WebSocket('ws://localhost:8080')

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.textAlign = 'center'

let players = []

let projectiles = []

let gameState = 'WAITING'
let winner = null
let maxPlayers = 0
let countdownRemaining = 0


// function to move
const loop = () => {
  // draw circle and clear old circle after new position is calculated so old frame isn't there
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  players.forEach((player) => {
    // placeholder for dead players
    if (gameState === 'IN_PROGRESS' && player.isDead === false && player.isEliminated === false) {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.fillText(player.name, player.x, player.y - 20)
    }
  })

  if (gameState === 'FINISHED' && winner) {
    ctx.fillStyle = 'white'
    ctx.font = '30px sans-serif' // you'll probably want a bigger font just for this
    ctx.fillText(`${winner.name} wins!`, canvas.width / 2, canvas.height / 2)
}
  if (gameState === 'WAITING') {
    ctx.fillStyle = 'white'
    ctx.font = '30px sans-serif'
    ctx.fillText("Waiting for players to join...", canvas.width / 2, canvas.height / 2)
    ctx.fillText(`${players.length} / ${maxPlayers}...`, canvas.width / 2 + 30, canvas.height / 2 + 30)
}

if (gameState === 'COUNTDOWN') {
    ctx.fillStyle = 'white'
    ctx.font = '30px sans-serif'
    ctx.fillText(`Starting in ${Math.ceil(countdownRemaining)}...`, canvas.width / 2, canvas.height / 2)
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
    players = data.players
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

loop()

