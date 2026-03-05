import { createInitialState, hardDrop, move, rotate, tick } from "./core/game.js";
import { renderGame } from "./ui/renderer.js";

const CELL_SIZE = 30;
const INITIAL_DROP_MS = 700;

const canvas = document.querySelector("#game");
const scoreEl = document.querySelector("#score");
const linesEl = document.querySelector("#lines");
const levelEl = document.querySelector("#level");
const stateEl = document.querySelector("#state");
const startButton = document.querySelector("#start");

const ctx = canvas.getContext("2d");
let state = createInitialState();
let lastTick = 0;
let running = false;

function updateHud() {
  scoreEl.textContent = String(state.score);
  linesEl.textContent = String(state.lines);
  levelEl.textContent = String(state.level);

  if (state.gameOver) {
    stateEl.textContent = "Game Over";
  } else {
    stateEl.textContent = running ? "Running" : "Paused";
  }
}

function currentDropInterval() {
  return Math.max(100, INITIAL_DROP_MS - (state.level - 1) * 50);
}

function render() {
  renderGame(ctx, state, CELL_SIZE);
  updateHud();
}

function gameLoop(timestamp) {
  if (!running || state.gameOver) {
    render();
    return;
  }

  if (timestamp - lastTick >= currentDropInterval()) {
    state = tick(state);
    lastTick = timestamp;
  }

  render();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  state = createInitialState();
  running = true;
  lastTick = performance.now();
  render();
  requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", () => {
  if (!running || state.gameOver) {
    startGame();
    return;
  }

  running = false;
  updateHud();
});

document.addEventListener("keydown", (event) => {
  if (!running || state.gameOver) {
    return;
  }

  if (event.code === "ArrowLeft") {
    state = move(state, -1, 0);
  }
  if (event.code === "ArrowRight") {
    state = move(state, 1, 0);
  }
  if (event.code === "ArrowDown") {
    state = tick(state);
  }
  if (event.code === "ArrowUp") {
    state = rotate(state);
  }
  if (event.code === "Space") {
    event.preventDefault();
    state = hardDrop(state);
  }

  render();
});

render();
