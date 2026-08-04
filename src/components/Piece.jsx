function Piece({ piece }) {
  const pieces = {
    
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",

    
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