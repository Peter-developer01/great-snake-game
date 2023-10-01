(function() {
const canvas = document.querySelector("canvas#game");

const scoreCounter = document.querySelector("#score-count");

const canvasWidth = parseInt(getComputedStyle(canvas).width);
const canvasHeight = parseInt(getComputedStyle(canvas).height);

const shadow = document.querySelector("#goal").attachShadow({"mode": "closed"});

let style = document.createElement("style");
style.innerHTML = "#reached { display: none; }";

shadow.append(style);

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

let rgb = [0, 0, 0];

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

		if (rgb[2] < 100) {
			rgb[2]++;
		} else {
			if (rgb[1] < 100) {
				rgb[1]++;
			} else {
				if (rgb[0] < 100) {
					rgb[0]++;
				} else {
					alert("Congratulations!!! You've successfully made it 10K! You now can share it on GitHub!")
					let divToAppend = document.createElement("div");
					divToAppend.innerHTML = '<h1 id="reached">Goal Reached!</h1><h4><a href="https://github.com/Peter-developer01/great-snake-game/discussions/1">Share it on GitHub!</a></h4><span>*Include screenshot too</span>';
					shadow.append(divToAppend);
					shadow.querySelector("style").remove();
					let style = "span { font-size: 11px; }";
					document.querySelector("#goal").style.display = "block";
				}
			}
		}

		ctx.fillStyle = "rgb( " + rgb.join(", ") + ")";


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
})();




