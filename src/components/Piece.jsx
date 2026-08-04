function Piece({ piece }) {
  const pieces = {
    // White
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",

    // Black
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  const isWhite = piece === piece.toUpperCase();

  return (
    <span
      className="piece"
      style={{
        color: isWhite ? "#ffffff" : "#000000",
      }}
    >
      {pieces[piece]}
    </span>
  );
}

export default Piece;