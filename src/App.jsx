import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { WORDS } from "./words.js";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const PRIORITY = { correct: 3, present: 2, absent: 1 };
const STATUS_COLORS = {
  3: "bg-green-600",
  2: "bg-amber-300",
  1: "bg-[#a4aec4]",
};

function getGuessStatuses(guess, answer) {
  let statuses = Array(5).fill(PRIORITY.absent);
  const letterCounts = answer.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] == answer[i]) {
      statuses[i] = PRIORITY.correct;
      letterCounts[answer[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] == PRIORITY.absent) {
      if (answer.includes(guess[i]) && letterCounts[guess[i]]) {
        statuses[i] = PRIORITY.present;
        letterCounts[guess[i]]--;
      }
    }
  }

  return statuses;
}

function getKeyboardStatuses(guesses, answer) {
  let letterStatusMap = {};

  for (const guess of guesses) {
    for (let i = 0; i < guess.length; i++) {
      const currentLetter = guess[i];
      if (!answer.includes(currentLetter)) {
        letterStatusMap[currentLetter] = letterStatusMap[currentLetter]
          ? Math.max(letterStatusMap[currentLetter], PRIORITY.absent)
          : PRIORITY.absent;
      } else if (answer.charAt(i) === currentLetter) {
        letterStatusMap[currentLetter] = PRIORITY.correct;
      } else {
        letterStatusMap[currentLetter] = letterStatusMap[currentLetter]
          ? Math.max(letterStatusMap[currentLetter], PRIORITY.present)
          : PRIORITY.present;
      }
    }
  }
  return letterStatusMap;
}

function Cell({ value, status, isSubmitted }) {
  return (
    <div
      className={`flex font-ultra text-4xl border border-gray-600 w-20 h-20 items-center justify-center font-bold
        ${STATUS_COLORS[status] ?? ""}
        ${isSubmitted ? "text-white" : "text-black"}
        `}
    >
      {value}
    </div>
  );
}

function Button({ value, status, handleKeyClick }) {
  return (
    <button
      className={`
    w-10 h-10 font-bold cursor-pointer
      ${STATUS_COLORS[status] ?? "bg-gray-50 hover:bg-gray-100"}
      ${status ? "text-white" : "text-black"}
    `}
      onClick={() => handleKeyClick(value)}
      onKeyDown={(e) => e.preventDefault()}
    >
      {value}
    </button>
  );
}

function Row({ guess, answer, isSubmitted }) {
  const guessStatuses = getGuessStatuses(guess, answer);
  return (
    <div className="flex gap-2">
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Cell
          key={i}
          value={guess.at(i)}
          status={isSubmitted ? guessStatuses[i] : undefined}
          isSubmitted={isSubmitted}
        />
      ))}
    </div>
  );
}

function Keyboard({ statuses, handleKeyClick }) {
  const ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return ROWS.map((row, rowIndex) => (
    <div key={rowIndex} className="flex gap-1">
      {row.map((letter) => (
        <Button
          value={letter}
          status={statuses[letter]}
          handleKeyClick={handleKeyClick}
        />
      ))}
    </div>
  ));
}

function Game() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState(() =>
    WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
  );
  const keyboardStatuses = getKeyboardStatuses(guesses, answer);

  function handleReset() {
    setCurrentGuess("");
    setGuesses([]);
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase());
  }

  function handleKeyClick(letter) {
    if (guesses.length >= MAX_GUESSES) return;
    if (guesses.at(-1) === answer) return;
    if (currentGuess.length < WORD_LENGTH)
      setCurrentGuess(currentGuess.concat(letter));
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const code = e.code;
      if (guesses.length >= MAX_GUESSES) return;
      if (guesses.at(-1) === answer) return;

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
          isSubmitted={i < guesses.length}
          answer={answer}
        />
      ))}

      {guesses.includes(answer) && <p>You won in {guesses.length} guesses!</p>}
      {guesses.length === MAX_GUESSES && !guesses.includes(answer) && (
        <p>You lost! Word was {answer}</p>
      )}
      <button onClick={handleReset}>Play Again</button>

      <Keyboard statuses={keyboardStatuses} handleKeyClick={handleKeyClick} />
    </div>
  );
}

function App() {
  return <Game />;
}

export default App;
