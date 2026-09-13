class Projectile {
    constructor(x, y, dx, dy, owner) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.owner = owner
        this.hit = false
    }

    update() {
        this.x += this.dx
        this.y += this.dy
    }

    isInScreen() {
        if (this.x > 600 || this.x < 0 || this.y > 400 || this.y < 0){
            return false
        }
        else {
            return true
        }
    }

    // returns boolean true if collides, false if not
    collidesWith(player) {
        let distance = Math.sqrt((this.x - player.x)**2 + (this.y - player.y)**2)
        return distance < 20
    }
}

module.exports = { Projectile }