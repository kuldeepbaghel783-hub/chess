import { cloneBoard } from "./helpers";
import { isCheck, isCheckmate, isStalemate } from "./checkLogic";
import { getNotation } from "./notation";

export function createMove(board, from, to, moveResult, turn) {
  const updatedBoard = cloneBoard(board);
  const movedPiece = updatedBoard[from.row][from.col];

  let targetPiece = updatedBoard[to.row][to.col];

  if (moveResult.special === "en-passant") {
    targetPiece = turn === "white" ? "p" : "P";
  }

  updatedBoard[to.row][to.col] = movedPiece;
  updatedBoard[from.row][from.col] = "";

  if (moveResult.special === "en-passant") {
    if (turn === "white") {
      updatedBoard[to.row + 1][to.col] = "";
    } else {
      updatedBoard[to.row - 1][to.col] = "";
    }
  }

  if (moveResult.special === "castle-king") {
    if (turn === "white") {
      updatedBoard[7][5] = updatedBoard[7][7];
      updatedBoard[7][7] = "";
    } else {
      updatedBoard[0][5] = updatedBoard[0][7];
      updatedBoard[0][7] = "";
    }
  }

  if (moveResult.special === "castle-queen") {
    if (turn === "white") {
      updatedBoard[7][3] = updatedBoard[7][0];
      updatedBoard[7][0] = "";
    } else {
      updatedBoard[0][3] = updatedBoard[0][0];
      updatedBoard[0][0] = "";
    }
  }

  if (moveResult.special === "promotion") {
    updatedBoard[to.row][to.col] = turn === "white" ? "Q" : "q";
  }

  const opponentTurn = turn === "white" ? "black" : "white";

  const check = isCheck(updatedBoard, opponentTurn);
  const mate = isCheckmate(updatedBoard, opponentTurn);

  const moveNotation = getNotation(
    movedPiece,
    from,
    to,
    targetPiece !== "" && targetPiece !== null,
    check,
    mate,
    moveResult.special
  );

  return {
    board: updatedBoard,
    notation: moveNotation,
    capturedPiece: targetPiece,
    nextTurn: opponentTurn,
  };
}

export function getGameStatus(board, turn) {
  if (isCheckmate(board, turn)) {
    const winner = turn === "white" ? "Black" : "White";
    return {
      gameOver: true,
      message: `Checkmate! ${winner} Wins`,
    };
  }

  if (isStalemate(board, turn)) {
    return {
      gameOver: true,
      message: "Stalemate",
    };
  }

  if (isCheck(board, turn)) {
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

export function switchTurn(turn) {
  return turn === "white" ? "black" : "white";
}

export function addCapturedPiece(captured, piece) {
  if (!piece) return captured;
  return [...captured, piece];
}