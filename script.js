const canvas = document.querySelector("canvas#game");

const scoreCounter = document.querySelector("#score-count");

const canvasWidth = parseInt(getComputedStyle(canvas).width);
const canvasHeight = parseInt(getComputedStyle(canvas).height);

let possiblePositions = [];
let currentPosition = "0,0";
/**
 * @type Array
 */
let currentFoodPosition;
let score = 0;
let oldPosition = ("/" + currentPosition).slice(1);
/**
 * Step for the snake to go on updating handler.
 */
const step = 20;

currentAction = null;

function coordsUnbox(position) {
	const splitted = position.split(",");

	return {
		x: +splitted[0],
		y: +splitted[1]
	};
}

function coordsBox(unboxed) {
	return [unboxed.x, unboxed.y].join(",");
}

const coords = {
	unbox: coordsUnbox,
	box: coordsBox
};

// alert(`${canvasWidth}x${canvasHeight}`);

/**
 * @type CanvasRenderingContext2D
 */
const ctx = canvas.getContext("2d");

for (let x = 0; x < canvasWidth; x += 20) {
	for (let y = 0; y < canvasHeight; y += 20) {
		console.log(`Coordinates: ${x}x${y}`);
		ctx.strokeRect(x, y, 20, 20);
		possiblePositions.push(`${x},${y}`);
	}
}

function drawFood() {
	let oldFillStyle = ctx.fillStyle;

	ctx.fillStyle = "red";
	ctx.fillRect(...currentFoodPosition, step, step);
	ctx.fillStyle = oldFillStyle;
}

function updateCoords(coordsUnboxed, action) {
	let unboxed = coordsUnboxed;

	if (action !== null) switch (action) {
		case "top":
			console.log("TOP");
			unboxed.y -= step;
			break;
		case "right":
			console.log("RIGHT");
			unboxed.x += step;
			break;
		case "bottom":
			console.log("BOTTOM");
			unboxed.y += step;
			break;
		case "left":
			console.log("LEFT");
			unboxed.x -= step;
			break;
		default:
			throw new Error(`Unable to update coords. Please check that the action "${action}" is correct.`);
	}

	console.log(unboxed);

	currentPosition = coords.box(unboxed);

	return unboxed;
}

function updateSnake(newPosition, action) {
	let updatedPosition = coords.unbox(newPosition);

	let pos = coords.unbox(newPosition);
	ctx.clearRect(pos.x, pos.y, step, step);
	ctx.strokeRect(pos.x, pos.y, step, step);

	try {
		updatedPosition = updateCoords(updatedPosition, action);
	} catch (error) {
		console.log("Error! Please see your code again and try to fix the error.");
		console.log(`The error is: ${error.toString()}\n\n`);
	}

	oldPosition = newPosition;
	currentPosition = coords.box(updatedPosition);
}

function update() {
	updateSnake(currentPosition, currentAction);
	let pos = coords.unbox(currentPosition);
	ctx.fillRect(pos.x, pos.y, step, step);

	if ([pos.x, pos.y].toString() === currentFoodPosition.toString()) {
		score++;
		scoreCounter.innerHTML = score;

		currentFoodPosition = [...possiblePositions[Math.ceil(Math.random() * possiblePositions.length)].split(",")];
		currentFoodPosition[0] = +currentFoodPosition[0];
		currentFoodPosition[1] = +currentFoodPosition[1];

		drawFood();
	}
}

function start() {
	let pos = coords.unbox(currentPosition);
	ctx.fillRect(pos.x, pos.y, step, step);

	let oldFillStyle = ctx.fillStyle;

	ctx.fillStyle = "red";

	currentFoodPosition = [...possiblePositions[Math.ceil(Math.random() * possiblePositions.length)].split(",")];
	currentFoodPosition[0] = +currentFoodPosition[0];
	currentFoodPosition[1] = +currentFoodPosition[1];

	console.log("ctx.fillRect(", ...[...possiblePositions[Math.ceil(Math.random() * possiblePositions.length)].split(",")], step, step, ");");
	ctx.fillRect(...currentFoodPosition, step, step);
	ctx.fillStyle = oldFillStyle;
}

start();


document.addEventListener("keydown", (event) => {
	let notArrows = false;
	let action;

	let wasdKey = event.key.toLowerCase();

	if (event.key == "ArrowUp" || wasdKey === "w") currentAction = "top";
	else if (event.key == "ArrowRight" || wasdKey === "d") currentAction = "right";
	else if (event.key == "ArrowDown" || wasdKey === "s") currentAction = "bottom";
	else if (event.key == "ArrowLeft" || wasdKey === "a") currentAction = "left";
	else { action = undefined; notArrows = true; }

	if (notArrows) {
		action = null;
	} else {
		event.preventDefault();
	}

	console.log(`The action is: go to ${action}`);

	console.log(event.key);

	if (!notArrows) update();
});





