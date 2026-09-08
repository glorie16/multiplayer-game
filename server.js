const WebSocket = require('ws');

const server = new WebSocket.Server({port: 8080});

const players = new Map()

let projectiles = []

let speed = 5

const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'purple']

const names = ['Bob', 'Marshal', 'Rudy', 'Cat', 'Diva', 'Skye']

setInterval (() => {
    projectiles.forEach((projectile) => {
        projectile.x += projectile.dx
        projectile.y += projectile.dy

        Array.from(players.entries()).forEach(([playerSocket, playerData]) => {
            let distance = Math.sqrt((projectile.x - playerData.x)**2 + (projectile.y - playerData.y)**2)
            if (distance < 20) {
                if (projectile.owner != playerSocket) {
                    console.log("Player hit!")
                    projectile.hit = true
                }
            }
        })
    })

    // filter creates entirely new array
    projectiles = projectiles.filter((projectile) => {
        if (projectile.x > 600 || projectile.x < 0 || projectile.y > 400 || projectile.y < 0) {
            return false
        }
        if (projectile.hit == true) {
            return false
        }
        return true
    })
}, 10)

// runs once per new client that connects
server.on('connection', (socket) => {
    console.log("A client connected!")

    const colorValue = Math.floor(Math.random() * colors.length)

    const nameValue = Math.floor(Math.random() * names.length)

    players.set(socket, {x:300, y:200, movingRight: false, movingLeft: false, movingUp: false, movingDown: false, color: colors[colorValue], name: names[nameValue]})
    
    socket.on('message', (message) => {
        const data = JSON.parse(message)
        console.log(data)

        if (data.type === 'keydown' || data.type === 'keyup'){
            const pressed = data.type === 'keydown'
            if (data.key.toLowerCase() === 'd') {
                players.get(socket).movingRight = pressed
            }
            else if (data.key.toLowerCase() === 'a') {
                players.get(socket).movingLeft = pressed
            }
            else if (data.key.toLowerCase() === 'w') {
                players.get(socket).movingUp = pressed
            }
            else if (data.key.toLowerCase() === 's') {
                players.get(socket).movingDown = pressed
            }
        }

        if (data.type === 'mousemove') {
            players.get(socket).mouseX = data.x
            players.get(socket).mouseY = data.y
        }

        if (data.type === 'click') {
            let x = players.get(socket).x
            let y = players.get(socket).y
            let mouseX = players.get(socket).mouseX
            let mouseY = players.get(socket).mouseY
            console.log(mouseX, mouseY)

            let deltaY = mouseY - y
            let deltaX = mouseX - x
            
            let angle = Math.atan2(deltaY, deltaX)

            let dx = Math.cos(angle) * speed
            let dy = Math.sin(angle) * speed

            const projectile_object = {x, y, dx, dy, owner: socket}
            console.log(x, y, mouseX, mouseY, deltaX, deltaY, angle)
            projectiles.push(projectile_object)
        }
    })

    const timerId = setInterval(() => {
        if (players.get(socket).movingRight){
            players.get(socket).x += 10/6
            }

        if (players.get(socket).movingLeft){
            players.get(socket).x -= 10/6
            }

        if (players.get(socket).movingUp){
            players.get(socket).y -= 10/6
            }

        if (players.get(socket).movingDown){
            players.get(socket).y += 10/6
        }

        const allPlayers = Array.from(players.values())
        socket.send(JSON.stringify({players: allPlayers, projectiles: projectiles}))
    }, 10);

    socket.on('close', () => {
        clearInterval(timerId)
        players.delete(socket)
    })
    
})

console.log("Server listening on ws://localhost:8080/")