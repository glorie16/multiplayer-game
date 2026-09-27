const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400   // gameplay area only, not counting the client's HUD strip
const PLAYER_RADIUS = 15
const PROJECTILE_RADIUS = 5

const PLAYER_MIN_X = PLAYER_RADIUS
const PLAYER_MAX_X = CANVAS_WIDTH - PLAYER_RADIUS
const PLAYER_MIN_Y = PLAYER_RADIUS + 20   // +20 matches your existing top margin
const PLAYER_MAX_Y = CANVAS_HEIGHT - PLAYER_RADIUS

module.exports = {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLAYER_RADIUS,
    PROJECTILE_RADIUS,
    PLAYER_MIN_X,
    PLAYER_MAX_X,
    PLAYER_MIN_Y,
    PLAYER_MAX_Y,
}