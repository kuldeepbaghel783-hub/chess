const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

const pieceNotation = {
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

export function getNotation(piece, from, to, captured = false) {
  const pieceName = pieceNotation[piece];

  const destination = `${files[to.col]}${8 - to.row}`;

  if (captured) {
    return `${pieceName}x${destination}`;
  }

  return `${pieceName}${destination}`;
}