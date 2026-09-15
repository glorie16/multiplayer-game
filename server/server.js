const WebSocket = require('ws');

// require Player object from Player.js
const { Player } = require('./Player.js')
const { Projectile } = require('./Projectile.js')
const { Room } = require('./Room.js')

const server = new WebSocket.Server({port: 8080});

let nextRoomId = 0
// const defaultRoom = new Room()
const Rooms = new Map()

let speed = 5

const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'purple']

const names = ['Bob', 'Marshal', 'Rudy', 'Cat', 'Diva', 'Skye']

function getAvailableRooms() {
    for (const room of Rooms.values()) {
        if (!room.isFull()){
            return room
        }
    }
    const room = new Room()
    nextRoomId += 1
    Rooms.set(nextRoomId, room)
    return room
}

// runs once per new client that connects
server.on('connection', (socket) => {
    console.log("A client connected!")

    const colorValue = Math.floor(Math.random() * colors.length)

    const nameValue = Math.floor(Math.random() * names.length)

    const player = new Player(names[nameValue], colors[colorValue])

    const matchedRoom = getAvailableRooms()
    matchedRoom.players.set(socket, player)
    //players.set(socket, {x:300, y:200, movingRight: false, movingLeft: false, movingUp: false, movingDown: false, color: colors[colorValue], name: names[nameValue], health: 100, isDead:false})
    
    socket.on('message', (message) => {
        const data = JSON.parse(message)
        console.log(data)

        if (data.type === 'keydown' || data.type === 'keyup'){
            const pressed = data.type === 'keydown'
            if (data.key.toLowerCase() === 'd') {
                player.movingRight = pressed
            }
            else if (data.key.toLowerCase() === 'a') {
                player.movingLeft = pressed
            }
            else if (data.key.toLowerCase() === 'w') {
                player.movingUp = pressed
            }
            else if (data.key.toLowerCase() === 's') {
                player.movingDown = pressed
            }
        }

        if (data.type === 'mousemove') {
            player.mouseX = data.x
            player.mouseY = data.y
        }

        if (data.type === 'click') {
            let x = player.x
            let y = player.y
            let mouseX = player.mouseX
            let mouseY = player.mouseY
            console.log(mouseX, mouseY)

            let deltaY = mouseY - y
            let deltaX = mouseX - x
            
            let angle = Math.atan2(deltaY, deltaX)

            let dx = Math.cos(angle) * speed
            let dy = Math.sin(angle) * speed

            const projectile = new Projectile(x, y, dx, dy, socket)
            
            // message for debugging
            console.log(x, y, mouseX, mouseY, deltaX, deltaY, angle)
            matchedRoom.projectiles.push(projectile)
        }
    })

    const timerId = setInterval(() => {
    
        player.move()

        const allPlayers = Array.from(matchedRoom.players.values())
        socket.send(JSON.stringify({players: allPlayers, projectiles: matchedRoom.projectiles}))
    }, 10);

    socket.on('close', () => {
        clearInterval(timerId)
        matchedRoom.players.delete(socket)
    })

})

console.log("Server listening on ws://localhost:8080/")