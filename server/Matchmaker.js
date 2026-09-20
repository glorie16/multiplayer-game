const { Room } = require('./Room.js')

class Matchmaker{
    constructor(rooms) {
    this.queue = new Map()
    this.widenRate = 20
    this.baseRange = 20

    this.rooms = rooms

    this.nextRoomId = 0

    this.minPlayers = 2
    this.maxPlayers = 4

    setInterval(() => {
        this.findMatch()
        }, 1000)

    }

    getAllowedRange(player) {
        const secondsWaited = (Date.now() - player.queuedAt) / 1000
        const allowedRange = this.baseRange + (secondsWaited * this.widenRate)
        return allowedRange
    }

    findMatch() {
        console.log(`Checking queue, size: ${this.queue.size}`)
        if (this.queue.size < this.minPlayers) return

        let longestWaiting = null

        

        Array.from(this.queue.values()).forEach((playerData) => {
            if (longestWaiting === null || playerData.queuedAt < longestWaiting.queuedAt){
                longestWaiting = playerData
            }
        } 
    )
        let group = []
        let allowedRange = this.getAllowedRange(longestWaiting)

        console.log(`Longest waiting: ${longestWaiting.name} (${longestWaiting.rating}), range: ±${allowedRange}`)

        Array.from(this.queue.entries()).forEach(([socket, playerData]) => {
            if (group.length >= this.maxPlayers) return
            if ((longestWaiting.rating - allowedRange) <= playerData.rating && playerData.rating <= (allowedRange + longestWaiting.rating)) {
                group.push([socket, playerData])
            }
        })

        if (group.length >= this.minPlayers) {
            const room = new Room()

            this.nextRoomId += 1
            let roomId = this.nextRoomId
          
            group.forEach(([socket, playerData]) => {
                playerData.room = room
                room.players.set(socket, playerData)
            })

            this.rooms.set(roomId, room)

            group.forEach(([socket, playerData]) =>{
                this.queue.delete(socket)
            })
        }
    }
}

module.exports = { Matchmaker}