
import { useState } from "react";

import "./App.css";

import Board from "./components/Board";
import Timer from "./components/Timer";
import MoveList from "./components/MoveList";

import { initialBoard } from "./utils/initialBoard";
import { validateMove } from "./utils/moveValidator";
import { getLegalMoves } from "./utils/checkLogic";

import {
  createMove,
  getGameStatus,
  switchTurn,
  addCapturedPiece,
} from "./utils/gameEngine";

function App() {
  const [board, setBoard] = useState(initialBoard);

  const [turn, setTurn] = useState("white");

  const [selected, setSelected] = useState(null);

  const [legalMoves, setLegalMoves] = useState([]);

  const [moveHistory, setMoveHistory] = useState([]);

  const [capturedWhite, setCapturedWhite] = useState([]);

  const [capturedBlack, setCapturedBlack] = useState([]);

  const [status, setStatus] = useState("");

  const [history, setHistory] = useState([]);

    const handleSquareClick = (row, col) => {
    const clickedPiece = board[row][col];

    // Select Piece
    if (!selected) {
      if (clickedPiece === "") return;

      if (
        turn === "white" &&
        clickedPiece !== clickedPiece.toUpperCase()
      ) {
        return;
      }

      if (
        turn === "black" &&
        clickedPiece !== clickedPiece.toLowerCase()
      ) {
        return;
      }

      const from = {
        row,
        col,
      };

      const moves = getLegalMoves(
        board,
        from,
        turn
      );

      setSelected(from);

      setLegalMoves(moves);

      return;
    }

        const from = selected;

    const to = {
      row,
      col,
    };

    const result = validateMove(
      board,
      from,
      to,
      turn
    );

    if (!result.valid) {
      setSelected(null);
      setLegalMoves([]);
      return;
    }



    if (!result.valid) {
  setSelected(null);
  setLegalMoves([]);
  return;
}
        // Save board for Undo
    setHistory((prev) => [
      ...prev,
      board.map((row) => [...row]),
    ]);

    // Execute move using Game Engine
    const move = createMove(
      board,
      from,
      to,
      result,
      turn
    );

    // Update board
    setBoard(move.board);

    // Save move history
    setMoveHistory((prev) => [
      ...prev,
      move.notation,
    ]);

    // Save captured piece
    if (move.capturedPiece !== "") {
      if (
        move.capturedPiece ===
        move.capturedPiece.toUpperCase()
      ) {
        setCapturedWhite((prev) =>
          addCapturedPiece(
            prev,
            move.capturedPiece
          )
        );
      } else {
        setCapturedBlack((prev) =>
          addCapturedPiece(
            prev,
            move.capturedPiece
          )
        );
      }
    }

    // Next player's turn
    const nextTurn = switchTurn(turn);

    setTurn(nextTurn);

    // Check game status
    const gameStatus =
      getGameStatus(
        move.board,
        nextTurn
      );

    setStatus(gameStatus.message);

    // Clear selection
    setSelected(null);

    setLegalMoves([]);
  };

 


const restartGame = () => {
  setBoard(initialBoard);

  setTurn("white");

  setSelected(null);

  setLegalMoves([]);

  setMoveHistory([]);

  setCapturedWhite([]);

  setCapturedBlack([]);

  setStatus("");

  setHistory([]);
};

return (
  <div className="app">
    <div className="left-panel">
      <Timer turn={turn} />

      <Board
        board={board}
        selected={selected}
        legalMoves={legalMoves}
        onSquareClick={handleSquareClick}
      />
    </div>

    <div className="right-panel">

      <h2>React Chess</h2>

      <h3>
        Current Turn :
        <span className="turn">
          {" "}
          {turn.toUpperCase()}
        </span>
      </h3>

      {status !== "" && (
        <div className="status-box">
          {status}
        </div>
      )}

      <div className="button-group">

        <button
          className="reset-btn"
          onClick={restartGame}
        >
          Restart
        </button>

        <button
  className="undo-btn"
  disabled
>
  Undo
</button>

      </div>

      <hr />

      <h3>Captured White Pieces</h3>

      <div className="captured">
        {capturedWhite.length === 0
          ? "-"
          : capturedWhite.join(" ")}
      </div>

      <h3>Captured Black Pieces</h3>

      <div className="captured">
        {capturedBlack.length === 0
          ? "-"
          : capturedBlack.join(" ")}
      </div>

      <hr />

      <MoveList
        moves={moveHistory}
      />

    </div>
  </div>
);

}

export default App;