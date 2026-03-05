const COLORS = {
  I: "#3cb4ff",
  O: "#ffcf40",
  T: "#b47dff",
  S: "#48d181",
  Z: "#ff6b6b",
  J: "#4d72ff",
  L: "#ff9940"
};

function rotateCellsClockwise(cells) {
  return cells.map(([x, y]) => [3 - y, x]);
}

function getPieceCells(type, rotation) {
  const base = {
    I: [[0, 1], [1, 1], [2, 1], [3, 1]],
    O: [[1, 0], [2, 0], [1, 1], [2, 1]],
    T: [[1, 0], [0, 1], [1, 1], [2, 1]],
    S: [[1, 0], [2, 0], [0, 1], [1, 1]],
    Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
    J: [[0, 0], [0, 1], [1, 1], [2, 1]],
    L: [[2, 0], [0, 1], [1, 1], [2, 1]]
  }[type];

  let cells = base;
  for (let i = 0; i < rotation; i += 1) {
    cells = rotateCellsClockwise(cells);
  }
  return cells;
}

function drawCell(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.strokeRect(x * size, y * size, size, size);
}

export function renderGame(ctx, state, cellSize) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let row = 0; row < state.board.length; row += 1) {
    for (let col = 0; col < state.board[row].length; col += 1) {
      const type = state.board[row][col];
      if (type) {
        drawCell(ctx, col, row, cellSize, COLORS[type]);
      }
    }
  }

  const piece = state.currentPiece;
  const cells = getPieceCells(piece.type, piece.rotation);
  for (const [x, y] of cells) {
    drawCell(ctx, piece.col + x, piece.row + y, cellSize, COLORS[piece.type]);
  }
}
