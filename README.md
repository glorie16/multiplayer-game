# Multiplayer Game Backend - Gloriele Mendoza

## Overview

This project is a browser-based multiplayer game.
    - Node.js
    - Javascript
    - Websockets

## Setup


## Architecture

### Server authority
This game uses a server-authoritative game state, so the server decides what is "true" in a match. The client connects to the WebSocket server, and their movements is sent to the server as input (keypresses, mouseclicks, etc.).

### Structure
Distinct items in the game, such as Player, Projectile, and Room are all classes with their own attributes.

### Matchmaking 
When a client connects, their player is generated with a random name, color, and rating. They are first loaded into a queue (implemented with a Map) where they wait to join a room with a similarly rated player. The longer the player with the longest waiting time has to wait to join a match, the wider the range of acceptable ratings increases. This prioritizes quick matchmaking while also considering similar ratings before putting players in the same room.

Each room needs a minimum of 2 players and a maximum of 4 players. Each room plays separately from each other. A Map is used to hold each distinct Room.

### Room Lifecycle
A room can be in 4 possible states: WAITING -> COUNTDOWN -> IN_PROGRESS -> FINISHED

# Game mechanics
Players can click to shoot projectiles. Each player gets 3 lives. When they are hit enough times by another player's projectile, they lose a life and respawn in a few seconds. The match ends when one player is left standing.