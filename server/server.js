const WebSocket = require('ws');

// require Player object from Player.js
const { Player } = require('./Player.js')
const { Projectile } = require('./Projectile.js')
// const { Room } = require('./Room.js')
const { Matchmaker } = require('./Matchmaker.js')

const server = new WebSocket.Server({port: 8080});

// const defaultRoom = new Room()
const Rooms = new Map()

const matchmaker = new Matchmaker(Rooms)

let speed = 5

const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'purple']

const names = ['Bob', 'Marshal', 'Rudy', 'Cat', 'Diva', 'Skye']

// function getAvailableRooms() {
//     for (const room of Rooms.values()) {
//         if (!room.isFull() && room.isJoinable()){
//             return room
//         }
//     }
//     const room = new Room()
//     nextRoomId += 1
//     room.id = nextRoomId
//     Rooms.set(nextRoomId, room)
//     return room
// }

// runs once per new client that connects
server.on('connection', (socket) => {
    console.log("A client connected!")
    

    const colorValue = Math.floor(Math.random() * colors.length)

    const nameValue = Math.floor(Math.random() * names.length)

    const ratingValue = Math.floor(Math.random() * (1200 - 600 + 1)) + 600

    const player = new Player(names[nameValue], colors[colorValue], ratingValue)

    player.queuedAt = Date.now()
    matchmaker.queue.set(socket, player)

    // const matchedRoom = getAvailableRooms()
    // matchedRoom.players.set(socket, player)
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

        if (data.type === 'click' && player.room && player.room.state == 'IN_PROGRESS') {
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
            player.room.projectiles.push(projectile)
        }
    })

    const timerId = setInterval(() => {

        if (player.room) {
    
            player.move()

            // const allPlayers = Array.from(player.room.players.values())

            const allPlayers = Array.from(player.room.players.values()).map((p) => {
                const { room, ...safeData } = p
                return safeData
            })

            let winner = null
            if (player.room.winner) {
                const { room, ...winnerData } = player.room.winner
                winner = winnerData
}
            socket.send(JSON.stringify({
                players: allPlayers, 
                projectiles: player.room.projectiles,
                state: player.room.state,
                winner: winner,
                // minPlayers: matchedRoom.minPlayers,
                maxPlayers: player.room.maxPlayers,
                countdownRemaining: player.room.countdownRemaining
            }))
        }
        else {
            console.log(`${player.name} still queued...`)
        }

    }, 10);

    socket.on('close', () => {
        clearInterval(timerId)
        if (player.room) {
            player.room.players.delete(socket)

            if (player.room.players.size === 0){   // <-- this runs unconditionally
                Rooms.delete(player.room.id)
                console.log(Rooms.size)
            }
        }
        else{
            matchmaker.queue.delete(socket)
        }
    })

})

console.log("Server listening on ws://localhost:8080/")