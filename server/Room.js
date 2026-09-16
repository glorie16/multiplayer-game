class Room {
    constructor() {
        this.players = new Map()
        this.projectiles = []
        this.maxPlayers = 4
        this.minPlayers = 2

        this.state = 'WAITING'

        this.countdownRemaining = 0
        this.countdownDuration = 5

        this.enteredStateAt = Date.now() // NEW
        this.finishedDuration = 5000 // NEW: ms to sit in FINISHED before resetting
        this.winner = null


        // call tick every 10 miliseconds
        setInterval (() => {
            this.tick()
        }, 10)
    }

    tick() {
        switch(this.state) {
            case 'WAITING':
                this.tickWaiting()
                break
            case 'COUNTDOWN':
                this.tickCountdown()
                break
            case 'IN_PROGRESS':
                this.tickInProgress()
                break
            case 'FINISHED':
                this.tickFinished()
                break
        }
    }

    tickWaiting(){
        if (this.players.size >= 2){
            this.setState('COUNTDOWN')
            this.countdownRemaining = this.countdownDuration
        }
    }

    tickCountdown(){
        this.countdownRemaining -= 0.01

        if (this.players.size < 2) {
            this.setState('WAITING')
        }

        if (this.countdownRemaining <= 0) {
            this.setState('IN_PROGRESS')
        }
    }

    tickInProgress() {
        this.projectiles.forEach((projectile) => {
        projectile.update()

        Array.from(this.players.entries()).forEach(([playerSocket, playerData]) => {
            if (projectile.collidesWith(playerData)) {
                if (projectile.owner != playerSocket && playerData.isDead === false) {
                    projectile.hit = true
                    playerData.health -= 10
                    console.log(`Player hit! Health: ${playerData.health}`)
                    
                    
                    if (playerData.health <= 0) {
                        playerData.isDead = true
                        playerData.lives -= 1
                        if (playerData.lives === 0) {
                            playerData.isEliminated = true
                        }
                        //reset health immediately for respawn
                        playerData.health = 100
                        console.log("Player died!")

                        if (!playerData.isEliminated) {
                            setTimeout(() => {
                                playerData.x = Math.floor(Math.random() * 600)
                                playerData.y = Math.floor(Math.random() * 400)

                                playerData.isDead = false
                            }, 3000)
                        }
                    }
                }
            }
        })
    })

    // filter creates entirely new array
    this.projectiles = this.projectiles.filter((projectile) => {
         if (projectile.hit == true) {
            return false
        }
        return projectile.isInScreen()
    })
    
    const alivePlayers = Array.from(this.players.values()).filter((player) => 
        !player.isEliminated)

    if (alivePlayers.length === 1 && this.players.size > 1) {
        this.winner = alivePlayers[0]
        this.setState('FINISHED')
        }
    }

    tickFinished() {
        const elapsed = Date.now() - this.enteredStateAt
        if (elapsed >= this.finishedDuration) {
        // TODO: reset scores, health, positions here before going back to WAITING
        this.setState('WAITING')
        }
    }

    isFull() {
        return this.players.size === this.maxPlayers
    }

    isJoinable() {
        return (this.state === 'WAITING' || this.state === 'COUNTDOWN')
    }

    setState(newState) {
        this.state = newState
        this.enteredStateAt = Date.now()
    }
}

module.exports = { Room }