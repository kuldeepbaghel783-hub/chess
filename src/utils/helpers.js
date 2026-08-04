// Clone the board (deep copy)
export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

// Check whether coordinates are inside the board
export function isInsideBoard(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Check whether two pieces belong to the same player
export function isSameColor(piece1, piece2) {
  if (!piece1 || !piece2) return false;

  return (
    (piece1 === piece1.toUpperCase() &&
      piece2 === piece2.toUpperCase()) ||
    (piece1 === piece1.toLowerCase() &&
      piece2 === piece2.toLowerCase())
  );
}

// Check if a piece belongs to white
export function isWhitePiece(piece) {
  return piece && piece === piece.toUpperCase();
}

// Check if a piece belongs to black
export function isBlackPiece(piece) {
  return piece && piece === piece.toLowerCase();
}

// Get opposite player
export function getOpponent(turn) {
  return turn === "white" ? "black" : "white";
}

// Find king position
export function findKing(board, turn) {
  const king = turn === "white" ? "K" : "k";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === king) {
        return { row, col };
      }
    }
  }

  return null;
}

// Move a piece on a copied board
export function makeMove(board, from, to) {
  const newBoard = cloneBoard(board);

  newBoard[to.row][to.col] =
    newBoard[from.row][from.col];

  newBoard[from.row][from.col] = "";

  return newBoard;
}

// Get every piece of a player
export function getAllPieces(board, turn) {
  const pieces = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];

      if (piece === "") continue;

      if (
        turn === "white" &&
        piece === piece.toUpperCase()
      ) {
        pieces.push({
          piece,
          row,
          col,
        });
      }

      if (
        turn === "black" &&
        piece === piece.toLowerCase()
      ) {
        pieces.push({
          piece,
          row,
          col,
        });
      }
    }
  }

  return pieces;
}