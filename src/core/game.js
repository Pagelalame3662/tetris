export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

const BASE_CELLS = {
  I: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1]
  ],
  O: [
    [1, 0],
    [2, 0],
    [1, 1],
    [2, 1]
  ],
  T: [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ],
  S: [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1]
  ],
  Z: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1]
  ],
  J: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ],
  L: [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ]
};

function rotateCellsClockwise(cells) {
  return cells.map(([x, y]) => [3 - y, x]);
}

function getPieceCells(type, rotation) {
  let cells = BASE_CELLS[type];
  for (let i = 0; i < rotation; i += 1) {
    cells = rotateCellsClockwise(cells);
  }
  return cells;
}

function getAbsoluteCells(piece) {
  return getPieceCells(piece.type, piece.rotation).map(([x, y]) => [
    piece.col + x,
    piece.row + y
  ]);
}

function randomPieceType(randomFn = Math.random) {
  const index = Math.floor(randomFn() * PIECE_TYPES.length);
  return PIECE_TYPES[Math.max(0, Math.min(index, PIECE_TYPES.length - 1))];
}

function spawnPiece(randomFn = Math.random) {
  return {
    type: randomPieceType(randomFn),
    rotation: 0,
    row: 0,
    col: 3
  };
}

export function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function isValidPosition(board, piece) {
  return getAbsoluteCells(piece).every(([x, y]) => {
    if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
      return false;
    }
    return board[y][x] === null;
  });
}

export function createInitialState(randomFn = Math.random) {
  const board = createEmptyBoard();
  const currentPiece = spawnPiece(randomFn);

  return {
    board,
    currentPiece,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: !isValidPosition(board, currentPiece)
  };
}

export function move(state, dx, dy) {
  if (state.gameOver) {
    return state;
  }

  const candidate = {
    ...state.currentPiece,
    col: state.currentPiece.col + dx,
    row: state.currentPiece.row + dy
  };

  if (!isValidPosition(state.board, candidate)) {
    return state;
  }

  return {
    ...state,
    currentPiece: candidate
  };
}

export function rotate(state) {
  if (state.gameOver) {
    return state;
  }

  const candidate = {
    ...state.currentPiece,
    rotation: (state.currentPiece.rotation + 1) % 4
  };

  const kicks = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [-2, 0],
    [2, 0],
    [0, -1]
  ];

  for (const [kx, ky] of kicks) {
    const kicked = {
      ...candidate,
      col: candidate.col + kx,
      row: candidate.row + ky
    };
    if (isValidPosition(state.board, kicked)) {
      return {
        ...state,
        currentPiece: kicked
      };
    }
  }

  return state;
}

function lockPiece(board, piece) {
  const nextBoard = board.map((row) => [...row]);
  for (const [x, y] of getAbsoluteCells(piece)) {
    nextBoard[y][x] = piece.type;
  }
  return nextBoard;
}

function clearCompletedLines(board) {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_HEIGHT - remaining.length;

  const nextBoard = [
    ...Array.from({ length: cleared }, () =>
      Array.from({ length: BOARD_WIDTH }, () => null)
    ),
    ...remaining
  ];

  return { board: nextBoard, cleared };
}

function scoreForClears(cleared, level) {
  const table = [0, 100, 300, 500, 800];
  return table[cleared] * level;
}

export function tick(state, randomFn = Math.random) {
  if (state.gameOver) {
    return state;
  }

  const dropped = move(state, 0, 1);
  if (dropped !== state) {
    return dropped;
  }

  const lockedBoard = lockPiece(state.board, state.currentPiece);
  const { board: clearedBoard, cleared } = clearCompletedLines(lockedBoard);

  const totalLines = state.lines + cleared;
  const level = 1 + Math.floor(totalLines / 10);
  const score = state.score + scoreForClears(cleared, state.level);

  const nextPiece = spawnPiece(randomFn);
  const gameOver = !isValidPosition(clearedBoard, nextPiece);

  return {
    board: clearedBoard,
    currentPiece: nextPiece,
    score,
    lines: totalLines,
    level,
    gameOver
  };
}

export function hardDrop(state, randomFn = Math.random) {
  if (state.gameOver) {
    return state;
  }

  let current = state;
  let moved = move(current, 0, 1);
  while (moved !== current) {
    current = moved;
    moved = move(current, 0, 1);
  }

  return tick(current, randomFn);
}
