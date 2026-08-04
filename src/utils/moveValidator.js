import { isSameColor } from "./helpers";


export function validateMove(
    board,
    from,
    to,
    turn,
    castleRights,
    lastMove
) {
  const piece = board[from.row][from.col];




  if (!piece) {
    return {
      valid: false,
      special: null,
      message: "No piece on that square.",
    };
  }




  
  if (
    turn === "white" &&
    piece !== piece.toUpperCase()
  ) {
    return {
      valid: false,
      special: null,
      message: "It's white's turn to move.",
    };
  }

  if (
    turn === "black" &&
    piece !== piece.toLowerCase()
  ) {
    return {
      valid: false,
      special: null,
      message: "It's black's turn to move.",
    };
  }

  const target = board[to.row][to.col];

  if (
    target !== "" &&
    isSameColor(piece, target)
  ) {
    return {
      valid: false,
      special: null,
      message: "Cannot capture your own piece.",
    };
  }

  switch (piece.toLowerCase()) {
    case "p":
      return validatePawn(
        board,
        from,
        to,
        piece,
        lastMove
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

    case "k":
      return validateKing(
        board,
        from,
        to,
        castleRights,
        turn
      );

    default:
      return {
        valid: false,
        special: null,
        message: "Unknown piece.",
      };
  }
}




function validatePawn(board, from, to, piece, lastMove) {
  const direction =
    piece === piece.toUpperCase() ? -1 : 1;

  const startRow =
    piece === piece.toUpperCase() ? 6 : 1;

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

 
  if (
    Math.abs(to.col - from.col) === 1 &&
    to.row === from.row + direction &&
    board[to.row][to.col] === "" &&
    lastMove &&
    lastMove.piece &&
    lastMove.piece.toLowerCase() === "p" &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    lastMove.to.row === from.row &&
    lastMove.to.col === to.col
  ) {
    return {
      valid: true,
      special: "en-passant",
    };
  }

  return {
    valid: false,
    special: null,
    message: "Illegal pawn move.",
  };
}


function validateRook(board, from, to) {
  if (from.row !== to.row && from.col !== to.col) {
    return {
      valid: false,
      special: null,
      message: "Rook must move in a straight line.",
    };
  }

  if (from.row === to.row) {
    const step = to.col > from.col ? 1 : -1;

    for (
      let c = from.col + step;
      c !== to.col;
      c += step
    )
    
    {
      if (board[from.row][c] !== "") {
        return {
          valid: false,
          special: null,
          message: "Path is blocked.",
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
          message: "Path is blocked.",
        };
      }
    }
  }

  return {
    valid: true,
    special: null,
  };
}


function validateKnight(from, to) {
  const row = Math.abs(from.row - to.row);
  const col = Math.abs(from.col - to.col);

  const valid =
    (row === 2 && col === 1) ||
    (row === 1 && col === 2);

  return {
    valid,
    special: null,
    message: valid ? undefined : "Illegal knight move.",
  };
}




function validateBishop(board, from, to) {
  if (
    Math.abs(from.row - to.row) !==
    Math.abs(from.col - to.col)
  ) {
    return {
      valid: false,
      special: null,
      message: "Bishop must move diagonally.",
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
        message: "Path is blocked.",
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

function validateQueen(board, from, to) {
  const rookMove = validateRook(board, from, to);

  if (rookMove.valid) {
    return rookMove;
  }

  const bishopMove = validateBishop(board, from, to);

  if (bishopMove.valid) {
    return bishopMove;
  }

  return {
    valid: false,
    special: null,
    message: "Illegal queen move.",
  };
}





function validateKing(board, from, to, castleRights, turn) {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);

 
  if (rowDiff <= 1 && colDiff <= 1) {
    return {
      valid: true,
      special: null,
    };
  }

  
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
      board[7][7] === "R" &&
      board[7][5] === "" &&
      board[7][6] === ""
    ) {
      return {
        valid: true,
        special: "castle-king",
      };
    }

    return {
      valid: false,
      special: null,
      message: "Castling is not allowed.",
    };
  }


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
      board[7][0] === "R" &&
      board[7][1] === "" &&
      board[7][2] === "" &&
      board[7][3] === ""
    ) {
      return {
        valid: true,
        special: "castle-queen",
      };
    }

    return {
      valid: false,
      special: null,
      message: "Castling is not allowed.",
    };
  }


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
      board[0][7] === "r" &&
      board[0][5] === "" &&
      board[0][6] === ""
    ) {
      return {
        valid: true,
        special: "castle-king",
      };
    }

    return {
      valid: false,
      special: null,
      message: "Castling is not allowed.",
    };
  }

  
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
      board[0][0] === "r" &&
      board[0][1] === "" &&
      board[0][2] === "" &&
      board[0][3] === ""
    ) {
      return {
        valid: true,
        special: "castle-queen",
      };
    }

    return {
      valid: false,
      special: null,
      message: "Castling is not allowed.",
    };
  }

  return {
    valid: false,
    special: null,
    message: "Illegal king move.",
  };
}


export function validateCompleteMove(
  board,
  from,
  to,
  turn,
  castleRights,
  lastMove
) {
  const result = validateMove(
    board,
    from,
    to,
    turn,
    castleRights,
    lastMove
  );

  if (!result.valid) {
    return {
      valid: false,
      message: result.message || "Illegal Move!",
      special: null,
    };
  }

  return {
    valid: true,
    message: "",
    special: result.special,
  };
}