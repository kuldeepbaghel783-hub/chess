import { useEffect, useState } from "react";

function Timer({ turn, gameOver, onTimeout }) {
  // 5 minutes = 300 seconds
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);

useEffect(() => {

    if (gameOver) return;

    const timer = setInterval(() => {

        if (turn === "white") {

            setWhiteTime(prev => {

                if (prev <= 0) {

                    clearInterval(timer);

                    onTimeout("white");

                    return 0;

                }

                return prev - 1;

            });

        } else {

            setBlackTime(prev => {

                if (prev <= 0) {

                    clearInterval(timer);

                    onTimeout("black");

                    return 0;

                }

                return prev - 1;

            });

        }

    }, 1000);

    return () => clearInterval(timer);

}, [turn, gameOver]);


  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <div className={`timer ${turn === "white" ? "active" : ""}`}>
        White : {formatTime(whiteTime)}
      </div>

      <div className={`timer ${turn === "black" ? "active" : ""}`}>
        Black : {formatTime(blackTime)}
      </div>
    </div>
  );
}

export default Timer;