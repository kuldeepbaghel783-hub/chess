import { validateMove } from "./moveValidator";
import { findKing, getAllPieces, makeMove } from "./helpers";



export function isSquareUnderAttack  (board, row, col, attackerColor) { 

  const pieces = getAllPieces (board, attackerColor);

  for  (let i = 0; i < pieces.length; i++) {
    const currentPiece = pieces[i];
    const from = { row: currentPiece.row, col: currentPiece.col };
    const to = { row, col };

    const result = validateMove(board, from, to, attackerColor, {
      whiteKingMoved: false,
      blackKingMoved: false,
      whiteLeftRookMoved: false,
      whiteRightRookMoved: false,
      blackLeftRookMoved: false,
      blackRightRookMoved: false,
    });

    if (result.valid) {
      return true;
    }
  }

  return false;
}

export function canCastle(board, turn, side, castleRights)

{
  const row = turn === "white" ? 7 : 0;
  const opponentColor = turn === "white" ? "black" : "white";

  if (
    (turn === "white" && castleRights.whiteKingMoved) ||
    (turn === "black" && castleRights.blackKingMoved)
  ) {
    return false;
  }

  if (isCheck(board, turn)) {
    return false;
  }

  if (side === "king") {
    if (
      isSquareUnderAttack(board, row, 5, opponentColor) ||
      isSquareUnderAttack(board, row, 6, opponentColor)
    ) {
      return false;
    }
    return true;
  }

  if (side === "queen") {
    if (
      isSquareUnderAttack(board, row, 3, opponentColor) ||
      isSquareUnderAttack(board, row, 2, opponentColor)
    ) {
      return false;
    }
    return true;
  }

  return false;
}

export function isCheck(board, turn) {
  const kingLocation = findKing(board, turn);

  if (!kingLocation) {
    return false;
  }

  const opponent = turn === "white" ? "black" : "white";
  return isSquareUnderAttack(board, kingLocation.row, kingLocation.col, opponent);
}

export function simulateMove(board, from, to) {
  return makeMove(board, from, to);
}

export function causesSelfCheck(board, from, to, turn) {
  const temporaryBoard = simulateMove(board, from, to);
  return isCheck(temporaryBoard, turn);
}

export function getLegalMoves(board, from, turn) {
  const legalMoves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const to = { row: r, col: c };

      const result = validateMove(board, from, to, turn, {
        whiteKingMoved: false,
        blackKingMoved: false,
        whiteLeftRookMoved: false,
        whiteRightRookMoved: false,
        blackLeftRookMoved: false,
        blackRightRookMoved: false,
      });

      if (!result.valid) {
        continue;
      }

      if (causesSelfCheck(board, from, to, turn)) {
        continue;
      }

      legalMoves.push(to);
    }
  }

  return legalMoves;
}

export function hasAnyLegalMove(board, turn) {
  const pieces = getAllPieces(board, turn);

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const from = { row: p.row, col: p.col };
    const moves = getLegalMoves(board, from, turn);

    if (moves.length > 0) {
      return true;
    }
  }

  return false;
}

export function isCheckmate(board, turn) {
  if (!isCheck(board, turn)) {
    return false;
  }

  return !hasAnyLegalMove(board, turn);
}

export function isStalemate(board, turn) {
  if (isCheck(board, turn)) {
    return false;
  }

  return !hasAnyLegalMove(board, turn);
}