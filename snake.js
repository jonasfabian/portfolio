Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

const REFRESH_RATE = 60;
const CELL_SIZE = 20;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

let canvas;
let ctx;
let player;
let directionState;

let itemList = [];

/**
 * Player constructor
 * */
const Player = (width, height, position, color, tail) => {
    return {
        width: width,
        height: height,
        position: position,
        color: color,
        tail: []
    }
}

/**
 * Draws a rectangle with coordinates, width, height, and canvas-context provided
 * */
const drawRectangle = (x, y, width, height, color, ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

/**
 * Draws a player
 * */
const drawPlayer = (ctx) => {
    // Draw head
    drawRectangle(player.position.x, player.position.y, player.width, player.height, player.color, ctx);

    // Draw tail
    player.tail.forEach(tailItem => {
        drawRectangle(tailItem.x, tailItem.y, player.width, player.height, player.color, ctx);
    });
}

/**
 * Draws the game grid
 * */
const drawGameGrid = (numberOfCells, ctx) => {
    let x = 0;
    let y = 0;

    while (x < CANVAS_WIDTH) {
        y = 0;
        while (y < CANVAS_HEIGHT) {
            drawRectangle(x, y, CELL_SIZE, CELL_SIZE, "whitesmoke", ctx);
            y += CELL_SIZE;
        }
        x += CELL_SIZE;
    }
}

/**
 * Initializes the player
 * */
const initPlayer = () => {
    const playerPosition = {
        x: CELL_SIZE,
        y: CELL_SIZE
    }
    player = Player(
        CELL_SIZE,
        CELL_SIZE,
        playerPosition,
        "Black"
    )
}

/**
 * Adds an item to the items-list
 * */
const addItem = (x, y) => {
    itemList.push(
        {
            color: "",
            width: CELL_SIZE,
            height: CELL_SIZE,
            position: {
                x: x,
                y: y
            }
        }
    );
}

/**
 * Adds a random item to the grid
 * */
const addRandomItem = () => {
    const randomCoordinates = getRandomCoordinates();
    addItem(randomCoordinates.x, randomCoordinates.y);
}

/**
 * Returns coordinates {x, y}
 * */
const getRandomCoordinates = () => {
    return {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)) * CELL_SIZE,
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)) * CELL_SIZE
    }
}

/**
 * Draws all items in itemList
 * */
const drawItems = (ctx) => {
    itemList.forEach(item =>
        drawRectangle(item.position.x, item.position.y, item.width, item.height, "green", ctx));
}

/**
 * Redraws the game-grid and player
 * */
const redraw = () => {
    drawGameGrid(10, ctx);
    drawPlayer(ctx);
    drawItems(ctx);
}

/**
 * Initializes the canvas
 * */
const initCanvas = () => {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");
    itemList = [];
    drawGameGrid(10, ctx);
    initPlayer();
    drawPlayer(ctx);
    addRandomItem();
    drawItems(ctx);
}
initCanvas();

/**
 * Checks whether two items have a collision
 * */
const checkCollision = (item1, item2) => {
    if (
        item1.position.x < item2.position.x + item2.width &&
        item1.position.x + item1.width > item2.position.x &&
        item1.position.y < item2.position.y + item2.height &&
        item1.position.y + item1.height > item2.position.y
    ) {
        return true;
    }
    return false;
}

/**
 * Checks whether the player has collision with an item
 * */
const getPlayerCollisionItem = () => {
    return itemList.find(item => checkCollision(player, item));
}

setInterval(() => {
    // Save current head position before moving
    const currentHeadPosition = { x: player.position.x, y: player.position.y };

    // Move the player based on the directionState
    switch (directionState) {
        case 'UP' :
            player.position.y = (player.position.y - CELL_SIZE).mod(CANVAS_HEIGHT);
            break;
        case 'LEFT' :
            player.position.x = (player.position.x - CELL_SIZE).mod(CANVAS_WIDTH);
            break;
        case 'DOWN' :
            player.position.y = (player.position.y + CELL_SIZE).mod(CANVAS_HEIGHT);
            break;
        case 'RIGHT' :
            player.position.x = (player.position.x + CELL_SIZE).mod(CANVAS_WIDTH);
            break;
        default :
            break;
    }

    // Check for collision with tail
    if (player.tail.length > 0) {
        // We only check collision with tail segments excluding the head position
        const headPosition = { x: player.position.x, y: player.position.y };
        if (player.tail.some(tailSegment => tailSegment.x === headPosition.x && tailSegment.y === headPosition.y)) {
            initCanvas();
            return;
        }
    }

    // Check for collision with items
    const collisionItem = getPlayerCollisionItem();
    if (collisionItem) {
        // Add a new segment to the tail at the end of the tail
        if (player.tail.length > 0) {
            const lastTailSegment = player.tail[player.tail.length - 1];
            player.tail.push({ ...lastTailSegment });
        } else {
            player.tail.push({ ...currentHeadPosition });
        }
        // Add a new random item
        addRandomItem();
        // Remove the collided item from the list
        itemList = itemList.filter(item => item !== collisionItem);
    }

    // Update the tail to follow the head
    if (player.tail.length > 0) {
        for (let i = player.tail.length - 1; i > 0; i--) {
            player.tail[i] = { ...player.tail[i - 1] };
        }
        player.tail[0] = { ...currentHeadPosition };
    }

    redraw();
}, REFRESH_RATE);

document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'w' :
            if (directionState === 'DOWN') break;
            directionState = 'UP';
            break;
        case 'a' :
            if (directionState === 'RIGHT') break;
            directionState = 'LEFT';
            break;
        case 's' :
            if (directionState === 'UP') break;
            directionState = 'DOWN';
            break;
        case 'd' :
            if (directionState === 'LEFT') break;
            directionState = 'RIGHT';
            break;
    }
})

