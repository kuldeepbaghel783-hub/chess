import { isSameColor } from "./helpers";

/*
==========================================
 Main Validator
==========================================
*/

export function validateMove(
    board,
    from,
    to,
    turn,
    castleRights
) {
  const piece = board[from.row][from.col];

  if (!piece) {
    return {
      valid: false,
      special: null,
    };
  }

  // Wrong player's turn
  if (
    turn === "white" &&
    piece !== piece.toUpperCase()
  ) {
    return {
      valid: false,
      special: null,
    };
  }

  if (
    turn === "black" &&
    piece !== piece.toLowerCase()
  ) {
    return {
      valid: false,
      special: null,
    };
  }

  const target = board[to.row][to.col];

  // Can't capture your own piece
  if (
    target !== "" &&
    isSameColor(piece, target)
  ) {
    return {
      valid: false,
      special: null,
    };
  }

  switch (piece.toLowerCase()) {
    case "p":
      return validatePawn(
        board,
        from,
        to,
        piece
      );

    case "r":
      return validateRook(
        board,
        from,
        to
      );

    case "n":
      return validateKnight(
        from,
        to
      );

    case "b":
      return validateBishop(
        board,
        from,
        to
      );

    case "q":
      return validateQueen(
        board,
        from,
        to
      );

 

    default:
      return {
        valid: false,
        special: null,
      };
  }
}

/* ---------------- Pawn ---------------- */

function validatePawn(board, from, to, piece) {
  const direction =
    piece === piece.toUpperCase() ? -1 : 1;

  const startRow =
    piece === piece.toUpperCase() ? 6 : 1;

  // One square forward
  if (
    from.col === to.col &&
    to.row === from.row + direction &&
    board[to.row][to.col] === ""
  ) {
    return {
      valid: true,
      special:
        to.row === 0 || to.row === 7
          ? "promotion"
          : null,
    };
  }

  // Two squares forward
  if (
    from.row === startRow &&
    from.col === to.col &&
    to.row === from.row + direction * 2 &&
    board[from.row + direction][from.col] === "" &&
    board[to.row][to.col] === ""
  ) {
    return {
      valid: true,
      special: null,
    };
  }

  // Capture
  if (
    Math.abs(to.col - from.col) === 1 &&
    to.row === from.row + direction &&
    board[to.row][to.col] !== ""
  ) {
    return {
      valid: true,
      special:
        to.row === 0 || to.row === 7
          ? "promotion"
          : null,
    };
  }

  return {
    valid: false,
    special: null,
  };
}
/* ---------------- Rook ---------------- */

function validateRook(board, from, to) {
  if (from.row !== to.row && from.col !== to.col) {
    return {
      valid: false,
      special: null,
    };
  }

  if (from.row === to.row) {
    const step = to.col > from.col ? 1 : -1;

    for (
      let c = from.col + step;
      c !== to.col;
      c += step
    ) {
      if (board[from.row][c] !== "") {
        return {
          valid: false,
          special: null,
        };
      }
    }
  }

  if (from.col === to.col) {
    const step = to.row > from.row ? 1 : -1;

    for (
      let r = from.row + step;
      r !== to.row;
      r += step
    ) {
      if (board[r][from.col] !== "") {
        return {
          valid: false,
          special: null,
        };
      }
    }
  }

  return {
    valid: true,
    special: null,
  };
}

/* ---------------- Knight ---------------- */

function validateKnight(from, to) {
  const row = Math.abs(from.row - to.row);
  const col = Math.abs(from.col - to.col);

  return {
    valid:
      (row === 2 && col === 1) ||
      (row === 1 && col === 2),
    special: null,
  };
}

/* ---------------- Bishop ---------------- */

function validateBishop(board, from, to) {
  if (
    Math.abs(from.row - to.row) !==
    Math.abs(from.col - to.col)
  ) {
    return {
      valid: false,
      special: null,
    };
  }

  const rowStep = to.row > from.row ? 1 : -1;
  const colStep = to.col > from.col ? 1 : -1;

  let r = from.row + rowStep;
  let c = from.col + colStep;

  while (r !== to.row) {
    if (board[r][c] !== "") {
      return {
        valid: false,
        special: null,
      };
    }

    r += rowStep;
    c += colStep;
  }

  return {
    valid: true,
    special: null,
  };
}

/* ---------------- Queen ---------------- */
function validateQueen(board, from, to) {
  const rookMove = validateRook(board, from, to);

  if (rookMove.valid) {
    return rookMove;
  }

  return validateBishop(board, from, to);
}

/* ---------------- King ---------------- */

function validateKing(board, from, to, castleRights, turn) {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);

  // Normal King Move
  if (rowDiff <= 1 && colDiff <= 1) {
    return {
      valid: true,
      special: null,
    };
  }

  // -----------------------
  // White Kingside Castling
  // -----------------------
  if (
    turn === "white" &&
    from.row === 7 &&
    from.col === 4 &&
    to.row === 7 &&
    to.col === 6
  ) {
    if (
      !castleRights.whiteKingMoved &&
      !castleRights.whiteRightRookMoved &&
      board[7][5] === "" &&
      board[7][6] === ""
    ) {
      return {
        valid: true,
        special: "castle-king",
      };
    }
  }

  // -----------------------
  // White Queenside Castling
  // -----------------------
  if (
    turn === "white" &&
    from.row === 7 &&
    from.col === 4 &&
    to.row === 7 &&
    to.col === 2
  ) {
    if (
      !castleRights.whiteKingMoved &&
      !castleRights.whiteLeftRookMoved &&
      board[7][1] === "" &&
      board[7][2] === "" &&
      board[7][3] === ""
    ) {
      return {
        valid: true,
        special: "castle-queen",
      };
    }
  }

  // -----------------------
  // Black Kingside Castling
  // -----------------------
  if (
    turn === "black" &&
    from.row === 0 &&
    from.col === 4 &&
    to.row === 0 &&
    to.col === 6
  ) {
    if (
      !castleRights.blackKingMoved &&
      !castleRights.blackRightRookMoved &&
      board[0][5] === "" &&
      board[0][6] === ""
    ) {
      return {
        valid: true,
        special: "castle-king",
      };
    }
  }

  // -----------------------
  // Black Queenside Castling
  // -----------------------
  if (
    turn === "black" &&
    from.row === 0 &&
    from.col === 4 &&
    to.row === 0 &&
    to.col === 2
  ) {
    if (
      !castleRights.blackKingMoved &&
      !castleRights.blackLeftRookMoved &&
      board[0][1] === "" &&
      board[0][2] === "" &&
      board[0][3] === ""
    ) {
      return {
        valid: true,
        special: "castle-queen",
      };
    }
  }

  return {
    valid: false,
    special: null,
  };
}


export function validateCompleteMove(
  board,
  from,
  to,
  turn,
  castleRights
) {
  const result = validateMove(
    board,
    from,
    to,
    turn,
    castleRights
  );

  if (!result.valid) {
    return {
      valid: false,
      message: "Illegal Move!",
      special: null,
    };
  }

  return {
    valid: true,
    message: "",
    special: result.special,
  };
}