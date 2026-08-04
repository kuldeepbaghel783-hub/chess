import { cloneBoard } from "./helpers";
import {
  isCheck,
  isCheckmate,
  isStalemate,
} from "./checkLogic";
import { getNotation } from "./notation";

export function createMove(
  board,
  from,
  to,
  moveResult,
  turn
) {
  const newBoard = cloneBoard(board);

  const movingPiece =
    newBoard[from.row][from.col];

  const capturedPiece =
    newBoard[to.row][to.col];

  // Move Piece
  newBoard[to.row][to.col] = movingPiece;
  newBoard[from.row][from.col] = "";

  // Pawn Promotion
  if (
    moveResult.special === "promotion"
  ) {
    newBoard[to.row][to.col] =
      turn === "white" ? "Q" : "q";
  }

  // Move Notation
  const notation = getNotation(
    movingPiece,
    from,
    to,
    capturedPiece !== ""
  );

  return {
    board: newBoard,

    notation,

    capturedPiece,

    nextTurn:
      turn === "white"
        ? "black"
        : "white",
  };
}


export function getGameStatus(
  board,
  turn
) {
  if (
    isCheckmate(board, turn)
  ) {
    return {
      gameOver: true,
      message: `Checkmate! ${
        turn === "white"
          ? "Black"
          : "White"
      } Wins`,
    };
  }

  if (
    isStalemate(board, turn)
  ) {
    return {
      gameOver: true,
      message: "Stalemate",
    };
  }

  if (
    isCheck(board, turn)
  ) {
    return {
      gameOver: false,
      message: "Check!",
    };
  }

  return {
    gameOver: false,
    message: "",
  };
}

export function switchTurn(
  turn
) {
  return turn === "white"
    ? "black"
    : "white";
}

export function addCapturedPiece(
  captured,
  piece
) {
  if (!piece) return captured;

  return [
    ...captured,
    piece,
  ];
}