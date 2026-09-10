class Player {
    constructor(name, color){
        this.name = name
        this.color = color
        this.x = 300
        this.y = 200
        this.movingLeft = false
        this.movingRight = false
        this.movingUp = false
        this.movingDown = false
        this.health = 100
        this.isDead = false
    }

    move() {
        //encapsulation
        if (!this.isDead) {
            if (this.movingRight) {
                this.x += 10/6
            }
            if (this.movingLeft) {
                this.x -= 10/6
            }
            if (this.movingUp) {
                this.y -= 10/6
            }
            if (this.movingDown) {
                this.y += 10/6
            }
        }
    }

    
}

module.exports = { Player }