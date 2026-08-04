import Square from "./Square";

function Board({
  board,
  selected,
  legalMoves,
  onSquareClick,
}) {
  const isLegalMove = (row, col) => {
    return legalMoves.some(
      (move) => move.row === row && move.col === col
    );
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            selected={
              selected &&
              selected.row === rowIndex &&
              selected.col === colIndex
            }
            legal={isLegalMove(rowIndex, colIndex)}
            onClick={() =>
              onSquareClick(rowIndex, colIndex)
            }
          />
        ))
      )}
    </div>
  );
}

export default Board;