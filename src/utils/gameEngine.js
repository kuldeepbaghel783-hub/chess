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

  let capturedPiece = newBoard[to.row][to.col];

  if (moveResult.special === "en-passant") {

    capturedPiece =
      turn === "white"
        ? "p"
        : "P";

  }

  // Move Piece
  newBoard[to.row][to.col] = movingPiece;
  newBoard[from.row][from.col] = "";

/* -------------------------
   En Passant
-------------------------- */

if (moveResult.special === "en-passant") {

  if (turn === "white") {

    // Remove captured black pawn
    newBoard[to.row + 1][to.col] = "";

  } else {

    // Remove captured white pawn
    newBoard[to.row - 1][to.col] = "";

  }

}


/* -------------------------
   Kingside Castling
-------------------------- */

if (moveResult.special === "castle-king") {

  // White
  if (turn === "white") {

    newBoard[7][5] = newBoard[7][7];
    newBoard[7][7] = "";

  }

  // Black
  else {

    newBoard[0][5] = newBoard[0][7];
    newBoard[0][7] = "";

  }

}

/* -------------------------
   Queenside Castling
-------------------------- */

if (moveResult.special === "castle-queen") {

  // White
  if (turn === "white") {

    newBoard[7][3] = newBoard[7][0];
    newBoard[7][0] = "";

  }

  // Black
  else {

    newBoard[0][3] = newBoard[0][0];
    newBoard[0][0] = "";

  }

}


  // Pawn Promotion
  if (
    moveResult.special === "promotion"
  ) {
    newBoard[to.row][to.col] =
      turn === "white" ? "Q" : "q";
  }

  // Move Notation
const opponent =
  turn === "white"
    ? "black"
    : "white";

const check = isCheck(
  newBoard,
  opponent
);

const mate = isCheckmate(
  newBoard,
  opponent
);

const notation = getNotation(
  movingPiece,
  from,
  to,
  capturedPiece !== "" && capturedPiece !== null,
  check,
  mate,
  moveResult.special
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