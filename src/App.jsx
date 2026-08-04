import { useState } from "react";
import {
  validateCompleteMove,
} from "./utils/moveValidator";
import "./App.css";
import { canCastle } from "./utils/checkLogic";
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

  const [gameOver, setGameOver] = useState(false);

  const [selected, setSelected] = useState(null);

  const [legalMoves, setLegalMoves] = useState([]);

  const [moveHistory, setMoveHistory] = useState([]);

  const [capturedWhite, setCapturedWhite] = useState([]);

  const [capturedBlack, setCapturedBlack] = useState([]);

  const [status, setStatus] = useState("");

  const [message, setMessage] = useState("");

  const [history, setHistory] = useState([]);

  const [lastMove, setLastMove] = useState(null);

 

  const [castleRights, setCastleRights] = useState({
    whiteKingMoved: false,
    blackKingMoved: false,

    whiteLeftRookMoved: false,
    whiteRightRookMoved: false,

    blackLeftRookMoved: false,
    blackRightRookMoved: false,
  });

  const handleSquareClick = (row, col) => {
    if (gameOver) {
      return;
    }

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

    const result = validateCompleteMove(
    board,
    from,
    to,
    turn,
    castleRights,
    lastMove
);

    if (!result.valid) {

      setMessage(result.message || "Illegal Move!");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      setSelected(null);

      setLegalMoves([]);

      return;
    }

    if (result.special === "castle-king") {

      if (!canCastle(board, turn, "king", castleRights)) {

        setMessage("Cannot castle through check.");

        setTimeout(() => {
          setMessage("");
        }, 2000);

        setSelected(null);

        setLegalMoves([]);

        return;

      }

    }

    if (result.special === "castle-queen") {

      if (!canCastle(board, turn, "queen", castleRights)) {

        setMessage("Cannot castle through check.");

        setTimeout(() => {
          setMessage("");
        }, 2000);

        setSelected(null);

        setLegalMoves([]);

        return;

      }

    }

    // Save board for Undo
    setHistory((prev) => [
      ...prev,



      {
        board: board.map((row) => [...row]),
        turn,
        moveHistory: [...moveHistory],
        capturedWhite: [...capturedWhite],
        capturedBlack: [...capturedBlack],
        status,
        castleRights: { ...castleRights },
        gameOver,
      },
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

    setLastMove({
      piece: board[from.row][from.col],
      from,
      to
    });

    // Save move history
    setMoveHistory((prev) => [
      ...prev,
      move.notation,
    ]);

    // Update Castling Rights
    const movingPiece = clickedPiece;

    if (movingPiece === "K") {
      setCastleRights(prev => ({
        ...prev,
        whiteKingMoved: true
      }));
    }

    if (movingPiece === "k") {
      setCastleRights(prev => ({
        ...prev,
        blackKingMoved: true
      }));
    }

    if (movingPiece === "R") {

      if (from.row === 7 && from.col === 0) {

        setCastleRights(prev => ({
          ...prev,
          whiteLeftRookMoved: true
        }));

      }

      if (from.row === 7 && from.col === 7) {

        setCastleRights(prev => ({
          ...prev,
          whiteRightRookMoved: true
        }));

      }

    }

    if (movingPiece === "r") {

      if (from.row === 0 && from.col === 0) {

        setCastleRights(prev => ({
          ...prev,
          blackLeftRookMoved: true
        }));

      }

      if (from.row === 0 && from.col === 7) {

        setCastleRights(prev => ({
          ...prev,
          blackRightRookMoved: true
        }));

      }

    }

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
    const gameStatus = getGameStatus(
      move.board,
      nextTurn
    );

    setStatus(gameStatus.message);

    if (gameStatus.gameOver) {
      setGameOver(true);
    }

    setSelected(null);

    setLegalMoves([]);
  };

  const undoMove = () => {

    if (history.length === 0) return;

    const previous = history[history.length - 1];

    setBoard(previous.board);

    setTurn(previous.turn);

    setMoveHistory(previous.moveHistory);

    setCapturedWhite(previous.capturedWhite);

    setCapturedBlack(previous.capturedBlack);

    setStatus(previous.status);

    setCastleRights(previous.castleRights);

    setGameOver(previous.gameOver);

    setHistory((prev) => prev.slice(0, -1));

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

    setLastMove(null);

    setGameOver(false);

    setCastleRights({
      whiteKingMoved: false,
      blackKingMoved: false,
      whiteLeftRookMoved: false,
      whiteRightRookMoved: false,
      blackLeftRookMoved: false,
      blackRightRookMoved: false,
    });

  };

  const handleTimeout = (player) => {

    setGameOver(true);

    if (player === "white") {

      setStatus("Black Wins by Time!");

    } else {

      setStatus("White Wins by Time!");

    }

  };

  return (
    <div className="app">
      <div className="left-panel">
        <Timer
          turn={turn}
          gameOver={gameOver}
          onTimeout={handleTimeout}
        />

        <Board
          board={board}
          selected={selected}
          legalMoves={legalMoves}
          onSquareClick={handleSquareClick}
        />
      </div>

      <div className="right-panel">


        {
          message &&
          <div className="error-message">
            {message}
          </div>
        }



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
            onClick={undoMove}
            disabled={history.length === 0}
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