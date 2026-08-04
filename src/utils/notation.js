const files = ["a", "b", "c", "d", "e", "f", "g", "h"


];

function getFile(col){
    return files[col];
}

const pieceNames = {
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

  // Castling
  if (special === "castle-king") {
    return "O-O";
  }

  if (special === "castle-queen") {
    return "O-O-O";
  }

  let notation = "";

  notation += pieceNames[piece];

  if(disambiguation){
    notation += disambiguation;
}

  notation += disambiguation;

  if (
  capture &&
  piece.toLowerCase() === "p"
) {

  notation += files[from.col];

  notation += "x";

}
else if(capture){

  notation += "x";

}

  notation += files[to.col];
  notation += 8 - to.row;

  if (checkmate) {
    notation += "#";
  }
  else if (check) {
    notation += "+";
  }

  return notation;
}