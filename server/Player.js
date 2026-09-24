class Player {
    constructor(name, color, rating){
        this.name = name
        this.color = color
        this.rating = rating
        this.x = 300
        this.y = 200
        this.movingLeft = false
        this.movingRight = false
        this.movingUp = false
        this.movingDown = false
        this.health = 100
        this.isDead = false

        this.lives = 3
        this.isEliminated = false

        this.room = null
    }

    move() {
        //encapsulation
        if (!this.isDead && !this.isEliminated) {
            if (this.movingRight) {
                this.x = Math.min(Math.max(this.x + 10/6, 0), 585)
            }
            if (this.movingLeft) {
                this.x = Math.max(this.x - 10/6, 15)
            }
            if (this.movingUp) {
                this.y = Math.max(this.y - 10/6, 35)
            }
            if (this.movingDown) {
                this.y = Math.min(Math.max(this.y + 10/6, 0), 385)
            }
        }
    }


}

module.exports = { Player }