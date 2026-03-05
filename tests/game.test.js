import { describe, expect, it } from "vitest";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  createEmptyBoard,
  createInitialState,
  isValidPosition,
  move,
  tick
} from "../src/core/game.js";

describe("Tetris game core", () => {
  it("creates an initial state with a valid active piece", () => {
    const state = createInitialState(() => 0);

    expect(state.board).toHaveLength(BOARD_HEIGHT);
    expect(state.board[0]).toHaveLength(BOARD_WIDTH);
    expect(state.gameOver).toBe(false);
    expect(isValidPosition(state.board, state.currentPiece)).toBe(true);
  });

  it("stops moving left at the board boundary", () => {
    let state = createInitialState(() => 1);

    for (let i = 0; i < 10; i += 1) {
      state = move(state, -1, 0);
    }

    const edgeState = move(state, -1, 0);
    expect(edgeState.currentPiece).toEqual(state.currentPiece);
  });

  it("locks a piece and clears a completed line on tick", () => {
    const board = createEmptyBoard();

    for (let col = 0; col < BOARD_WIDTH; col += 1) {
      if (col < 3 || col > 6) {
        board[BOARD_HEIGHT - 1][col] = "X";
      }
    }

    const state = {
      board,
      currentPiece: { type: "I", rotation: 0, row: BOARD_HEIGHT - 2, col: 3 },
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false
    };

    const next = tick(state, () => 1);

    expect(next.lines).toBe(1);
    expect(next.score).toBe(100);
    expect(next.board[BOARD_HEIGHT - 1].every((cell) => cell === null)).toBe(true);
  });

  it("sets game over when next spawn position is blocked", () => {
    const board = createEmptyBoard();
    board[1][3] = "X";

    const state = {
      board,
      currentPiece: { type: "O", rotation: 0, row: BOARD_HEIGHT - 2, col: 3 },
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false
    };

    const next = tick(state, () => 0);
    expect(next.gameOver).toBe(true);
  });
});
