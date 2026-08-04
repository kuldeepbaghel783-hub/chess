const fileNames = ["a", "b", "c", "d", "e", "f", "g", "h"];

function getFile(col) {
  return fileNames[col];
}

const pieceLetters = {
  K: "K",
  Q: "Q",
  R: "R",
  B: "B",
  N: "N",
  P: "",
  k: "K",
  q: "Q",
  r: "R",
  b: "B",
  n: "N",
  p: "",
};

export function getNotation(
  piece,
  from,
  to,
  capture = false,
  check = false,
  checkmate = false,
  special = null,
  disambiguation = ""
) {
  if (special === "castle-king") {
    return "O-O";
  }

  if (special === "castle-queen") {
    return "O-O-O";
  }

  let formattedNotation = "";

  formattedNotation += pieceLetters[piece];

  if (disambiguation) {
    formattedNotation += disambiguation;
  }

  if (capture) {
    if (piece.toLowerCase() === "p") {
      formattedNotation += getFile(from.col);
    }
    formattedNotation += "x";
  }

  formattedNotation += getFile(to.col);
  formattedNotation += 8 - to.row;

  if (checkmate) {
    formattedNotation += "#";
  } else if (check) {
    formattedNotation += "+";
  }

  return formattedNotation;
}