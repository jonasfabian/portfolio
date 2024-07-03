let canvas;
let ctx;

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const drawLine = (from, to, ctx) => {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

const drawGrid = (numberOfCells, ctx) => {
    const cellWidth = CANVAS_WIDTH / numberOfCells;
    let x = cellWidth;
    let y = cellWidth;
    while (x < CANVAS_WIDTH) {
        // draw vertical line
        const from = {x: x, y: 0};
        const to = {x: x, y: CANVAS_HEIGHT};
        drawLine(from, to, ctx);
        // increment x by cellWidth
        x += cellWidth;
    }
    while (y < CANVAS_HEIGHT) {
        // draw horizontal lines
        const from = {x: 0, y: y}
        const to = {x: CANVAS_WIDTH, y: y}
        drawLine(from, to, ctx)
        // increment y by cellWidth
        y += cellWidth;
    }
}

const initCanvas = () => {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");
    drawGrid(10, ctx);
}
initCanvas();

