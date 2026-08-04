import { useState } from "react";
import "./App.css";

import { initialBoard } from "./utils/initialBoard";
import { validateCompleteMove } from "./utils/moveValidator";
import { getLegalMoves, canCastle } from "./utils/checkLogic";
import { createMove, getGameStatus, switchTurn, addCapturedPiece } from "./utils/gameEngine";

import Board from "./components/Board";
import Timer from "./components/Timer";
import MoveList from "./components/MoveList";

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState("white");
  const [gameOver, setGameOver] = useState(false);

  const [selectedSquare, setSelectedSquare] = useState(null);
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

    if (!selectedSquare) {
      if (clickedPiece === "") return;

      const isWhite = clickedPiece === clickedPiece.toUpperCase();
      if ((turn === "white" && !isWhite) || (turn === "black" && isWhite)) {
        return;
      }

      const from = { row, col };
      const moves = getLegalMoves(board, from, turn);

      setSelectedSquare(from);
      setLegalMoves(moves);
      return;
    }

    const from = selectedSquare;
    const to = { row, col };

    if (from.row === to.row && from.col === to.col) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const result = validateCompleteMove(board, from, to, turn, castleRights, lastMove);

    if (!result.valid) {
      setMessage(result.message || "Illegal Move!");
      setTimeout(() => {
        setMessage("");
      }, 2000);

      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (result.special === "castle-king") {
      if (!canCastle(board, turn, "king", castleRights)) {
        setMessage("Cannot castle through check.");
        setTimeout(() => {
          setMessage("");
        }, 2000);

        setSelectedSquare(null);
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

        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        board: board.map((r) => [...r]),
        turn,
        moveHistory: [...moveHistory],
        capturedWhite: [...capturedWhite],
        capturedBlack: [...capturedBlack],
        status,
        castleRights: { ...castleRights },
        gameOver,
      },
    ]);

    const move = createMove(board, from, to, result, turn);

    setBoard(move.board);

    setLastMove({
      piece: board[from.row][from.col],
      from,
      to,
    });

    setMoveHistory((prev) => [...prev, move.notation]);

    const movingPiece = board[from.row][from.col];

    if (movingPiece === "K") {
      setCastleRights((prev) => ({ ...prev, whiteKingMoved: true }));
    }

    if (movingPiece === "k") {
      setCastleRights((prev) => ({ ...prev, blackKingMoved: true }));
    }

    if (movingPiece === "R") {
      if (from.row === 7 && from.col === 0) {
        setCastleRights((prev) => ({ ...prev, whiteLeftRookMoved: true }));
      }
      if (from.row === 7 && from.col === 7) {
        setCastleRights((prev) => ({ ...prev, whiteRightRookMoved: true }));
      }
    }

    if (movingPiece === "r") {
      if (from.row === 0 && from.col === 0) {
        setCastleRights((prev) => ({ ...prev, blackLeftRookMoved: true }));
      }
      if (from.row === 0 && from.col === 7) {
        setCastleRights((prev) => ({ ...prev, blackRightRookMoved: true }));
      }
    }

    if (move.capturedPiece !== "") {
      const cap = move.capturedPiece;
      if (cap === cap.toUpperCase()) {
        setCapturedWhite((prev) => addCapturedPiece(prev, cap));
      } else {
        setCapturedBlack((prev) => addCapturedPiece(prev, cap));
      }
    }

    const nextTurn = switchTurn(turn);
    setTurn(nextTurn);

    const gameStatus = getGameStatus(move.board, nextTurn);
    setStatus(gameStatus.message);

    if (gameStatus.gameOver) {
      setGameOver(true);
    }

    setSelectedSquare(null);
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
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setTurn("white");
    setSelectedSquare(null);
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
        <Timer turn={turn} gameOver={gameOver} onTimeout={handleTimeout} />

        <Board
          board={board}
          selected={selectedSquare}
          legalMoves={legalMoves}
          onSquareClick={handleSquareClick}
        />
      </div>

      <div className="right-panel">
        {message && <div className="error-message">{message}</div>}

        <h2>React Chess</h2>

        <h3>
          Current Turn :<span className="turn"> {turn.toUpperCase()}</span>
        </h3>

        {status !== "" && <div className="status-box">{status}</div>}

        <div className="button-group">
          <button className="reset-btn" onClick={restartGame}>
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
          {capturedWhite.length === 0 ? "-" : capturedWhite.join(" ")}
        </div>

        <h3>Captured Black Pieces</h3>

        <div className="captured">
          {capturedBlack.length === 0 ? "-" : capturedBlack.join(" ")}
        </div>

        <hr />

        <MoveList moves={moveHistory} />
      </div>
    </div>
  );
}

export default App;