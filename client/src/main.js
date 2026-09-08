const socket = new WebSocket('ws://localhost:8080')

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.textAlign = 'center'

let players = []

let projectiles = []

// function to move
const loop = () => {
  // draw circle and clear old circle after new position is calculated so old frame isn't there
  ctx.clearRect(0, 0, canvas.width, canvas.height)


  players.forEach((player) => {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.fillText(player.name, player.x, player.y - 20)

  })
  
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

