import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const ANSWER = "DIEGO";

function Cell({ value, status }) {
  return (
    <div
      className={`flex text-3xl border w-20 h-20 items-center justify-center text-center 
        ${status === "correct" ? "bg-green-300" : status === "absent" ? "bg-gray-50" : status === "present" ? "bg-yellow-100" : ""}
        `}
    >
      {value}
    </div>
  );
}

function Button({ value }) {
  return <button className="w-10 h-10 bg-gray-100 font-bold">{value}</button>;
}

function Row({ guess, getLetterStatus, isSubmitted }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Cell
          key={i}
          value={guess.at(i)}
          status={isSubmitted ? getLetterStatus(guess, i) : "absent"}
        />
      ))}
    </div>
  );
}

function Keyboard() {
  const ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return ROWS.map((row, rowIndex) => (
    <div key={rowIndex} className="flex gap-1">
      {row.map((letter) => (
        <Button value={letter} />
      ))}
    </div>
  ));
}

function Game() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  function getLetterStatus(guess, index) {
    const currentLetter = guess[index];
    if (!ANSWER.includes(currentLetter)) return "absent";
    else if (ANSWER.charAt(index) === currentLetter) return "correct";
    return "present";
  }

  function handleReset() {
    setCurrentGuess("");
    setGuesses([]);
  }

  useEffect(() => {
    function handleKey(e) {
      const code = e.code;
      console.log(e);
      console.log(guesses);

      if (guesses.length >= MAX_GUESSES) return;
      if (guesses.at(-1) === ANSWER) return;

      if (code.startsWith("Key")) {
        if (currentGuess.length < WORD_LENGTH)
          setCurrentGuess(currentGuess.concat(code.at(-1)));
      } else if (code === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (code === "Enter") {
        if (currentGuess.length == WORD_LENGTH) {
          setGuesses(guesses.concat(currentGuess));
          setCurrentGuess("");
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGuess, guesses]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-2">
      {Array.from({ length: MAX_GUESSES }, (_, i) => (
        <Row
          key={i}
          guess={
            i < guesses.length
              ? guesses[i]
              : i === guesses.length
                ? currentGuess
                : ""
          }
          getLetterStatus={getLetterStatus}
          isSubmitted={i < guesses.length}
        />
      ))}

      {guesses.includes(ANSWER) && <p>You won in {guesses.length} guesses!</p>}
      {guesses.length === MAX_GUESSES && !guesses.includes(ANSWER) && (
        <p>You lost! Word was {ANSWER}</p>
      )}
      <button onClick={handleReset}>Play Again</button>

      <Keyboard />
    </div>
  );
}

function App() {
  return <Game />;
}

export default App;
