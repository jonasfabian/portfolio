Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

const REFRESH_RATE = 1000;
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
const Player = (width, height, position, color) => {
    return {
        width: width,
        height: height,
        position: position,
        color: color
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
    drawRectangle(player.position.x, player.position.y, player.width, player.height, player.color, ctx);
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
            drawRectangle(x, y, CELL_SIZE, CELL_SIZE, "blue", ctx);
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
        "purple"
    )
}

/**
 * Adds an item to the items-list
 * */
const addItem = () => {
    itemList.push(
        {
            color: "",
            width: CELL_SIZE,
            height: CELL_SIZE,
            position: {
                x: 20,
                y: 40
            }
        }
    );
}

/**
 * Draws all items in itemList
 * */
const drawItems = (ctx) => {
    itemList.forEach(item =>
        drawRectangle(item.position.x, item.position.y, item.width, item.height, "yellow", ctx));
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
    addItem();
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
const playerHasCollisionWithItem = () => {
    return itemList.some(item => checkCollision(player, item));
}

setInterval(() => {
    switch (directionState) {
        case 'UP' :
            player.position.y = (player.position.y -= CELL_SIZE).mod(CANVAS_HEIGHT);
            if (playerHasCollisionWithItem()) alert("Collision");
            redraw();
            break;
        case 'LEFT' :
            player.position.x = (player.position.x -= CELL_SIZE).mod(CANVAS_WIDTH);
            if (playerHasCollisionWithItem()) alert("Collision");
            redraw();
            break;
        case 'DOWN' :
            player.position.y = (player.position.y += CELL_SIZE).mod(CANVAS_HEIGHT);
            if (playerHasCollisionWithItem()) alert("Collision");
            redraw();
            break;
        case 'RIGHT' :
            player.position.x = (player.position.x += CELL_SIZE).mod(CANVAS_WIDTH);
            if (playerHasCollisionWithItem()) alert("Collision");
            redraw();
            break;
        default :
            redraw();
            break;
    }
}, REFRESH_RATE);

document.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'w' :
            directionState = 'UP';
            break;
        case 'a' :
            directionState = 'LEFT';
            break;
        case 's' :
            directionState = 'DOWN';
            break;
        case 'd' :
            directionState = 'RIGHT';
            break;
    }
})

