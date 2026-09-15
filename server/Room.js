class Room {
    constructor() {
        this.players = new Map()
        this.projectiles = []
        this.maxPlayers = 4
        // call tick every 10 miliseconds
        setInterval (() => {
            this.tick()
        }, 10)
    }

    tick() {
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
                        //reset health immediately for respawn
                        playerData.health = 100
                        console.log("Player died!")

                        setTimeout(() => {
                            playerData.x = Math.floor(Math.random() * 600)
                            playerData.y = Math.floor(Math.random() * 400)

                            playerData.isDead = false
                        }, 3000)
    
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
    
    }

    isFull() {
        return this.players.size === this.maxPlayers
    }
}

module.exports = { Room }