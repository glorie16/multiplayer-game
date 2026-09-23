# Multiplayer Game Backend - Gloriele Mendoza

## Overview

This project is a browser-based multiplayer game.

Built with:
- Node.js
- JavaScript
- WebSockets

## Getting Started

```bash
cd server
npm install
node server.js
```

Then open the client HTML file in your browser. Open multiple tabs to simulate multiple players.

## Architecture

### Server authority
This game uses a server-authoritative game state, so the server decides what is "true" in a match. The client connects to the WebSocket server, and their movements are sent to the server as input (keypresses, mouseclicks, etc.). From there, the server processes the inputs and sends back to the client the state of the game, including Players positions, projectiles, and health.

### Structure
Distinct items in the game, such as Player, Projectile, and Room, are all classes with their own attributes.

### Matchmaking
When a client connects, their player is generated with a random name, color, and rating. They're first loaded into a queue (implemented with a Map) where they wait to join a room with a similarly rated player. The longer the longest-waiting player has to wait, the wider the range of acceptable ratings gets. This prioritizes quick matchmaking while still trying to keep ratings close.

Note: range checking is currently one-directional (based on the longest-waiting player's range only), which favors matchmaking speed over strict fairness.

### Room Lifecycle
Each room moves through states: `WAITING -> COUNTDOWN -> IN_PROGRESS -> FINISHED -> WAITING`.

- **WAITING**: room needs at least 2 players to start
- **COUNTDOWN**: enough players joined, short timer before the match begins
- **IN_PROGRESS**: actual gameplay - movement, shooting, collisions
- **FINISHED**: match is over, winner is shown, then the room resets

Each room needs a minimum of 2 players and a maximum of 4. Rooms are independent of each other and stored in a Map.

## Game Mechanics
Players can click to shoot projectiles. Each player gets 3 lives. When hit enough times by another player's projectile, they lose a life and respawn in a few seconds. The match ends when one player is left standing.