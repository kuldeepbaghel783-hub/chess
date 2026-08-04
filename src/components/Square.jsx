import Piece from "./Piece";

function Square({
  row,
  col,
  piece,
  selected,
  legal,
  onClick,
}) {
  const squareColor =
    (row + col) % 2 === 0 ? "light" : "dark";

  return (
    <div
      className={`square ${squareColor} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
  
      {piece && <Piece piece={piece} />}

      {!piece && legal && (
        <div className="legal-dot"></div>
      )}

     
      {piece && legal && (
        <div className="capture-ring"></div>
      )}
    </div>
  );
}

export default Square;