const { CANVAS_WIDTH, CANVAS_HEIGHT, PROJECTILE_RADIUS } = require('./constants.js')

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
        return (
            this.x + PROJECTILE_RADIUS >= 0 &&
            this.x - PROJECTILE_RADIUS <= CANVAS_WIDTH &&
            this.y + PROJECTILE_RADIUS >= 0 &&
            this.y - PROJECTILE_RADIUS <= CANVAS_HEIGHT
        )
    }

    // returns boolean true if collides, false if not
    collidesWith(player) {
        let distance = Math.sqrt((this.x - player.x)**2 + (this.y - player.y)**2)
        return distance < 20
    }
}

module.exports = { Projectile }