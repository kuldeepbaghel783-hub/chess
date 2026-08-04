import { validateMove } from "./moveValidator";
import {
  cloneBoard,
  findKing,
  getAllPieces,
  makeMove,
} from "./helpers";

/*
---------------------------------------
Check if a square is attacked
---------------------------------------
*/

export function isSquareUnderAttack(
  board,
  row,
  col,
  attackerColor
) {
  const pieces = getAllPieces(board, attackerColor);

  for (const current of pieces) {
    const from = {
      row: current.row,
      col: current.col,
    };

    const to = {
      row,
      col,
    };

    if (
      validateMove(
        board,
        from,
        to,
        attackerColor
      )
    ) {
      return true;
    }
  }

  return false;
}

/*
---------------------------------------
Is King in Check
---------------------------------------
*/

export function isCheck(board, turn) {
  const king = findKing(board, turn);

  if (!king) return false;

  const opponent =
    turn === "white"
      ? "black"
      : "white";

  return isSquareUnderAttack(
    board,
    king.row,
    king.col,
    opponent
  );
}

/*
---------------------------------------
Try a move safely
---------------------------------------
*/

export function simulateMove(
  board,
  from,
  to
) {
  return makeMove(board, from, to);
}

/*
---------------------------------------
Would this move leave king in check?
---------------------------------------
*/

export function causesSelfCheck(
  board,
  from,
  to,
  turn
) {
  const tempBoard = simulateMove(
    board,
    from,
    to
  );

  return isCheck(
    tempBoard,
    turn
  );
}/*
---------------------------------------
Get All Legal Moves for a Piece
---------------------------------------
*/

export function getLegalMoves(board, from, turn) {
  const legalMoves = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const to = { row, col };

      // Check normal movement rules
      if (!validateMove(board, from, to, turn)) {
        continue;
      }

      // Prevent moves that leave own king in check
      if (causesSelfCheck(board, from, to, turn)) {
        continue;
      }

      legalMoves.push(to);
    }
  }

  return legalMoves;
}

/*
---------------------------------------
Does Player Have Any Legal Move?
---------------------------------------
*/

export function hasAnyLegalMove(board, turn) {
  const pieces = getAllPieces(board, turn);

  for (const piece of pieces) {
    const from = {
      row: piece.row,
      col: piece.col,
    };

    const moves = getLegalMoves(board, from, turn);

    if (moves.length > 0) {
      return true;
    }
  }

  return false;
}

/*
---------------------------------------
Checkmate Detection
---------------------------------------
*/

export function isCheckmate(board, turn) {
  if (!isCheck(board, turn)) {
    return false;
  }

  return !hasAnyLegalMove(board, turn);
}

/*
---------------------------------------
Stalemate Detection
---------------------------------------
*/

export function isStalemate(board, turn) {
  if (isCheck(board, turn)) {
    return false;
  }

  return !hasAnyLegalMove(board, turn);
}