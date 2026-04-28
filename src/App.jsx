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
      className={`flex font-ultra text-2xl border-2 border-gray-400 w-14 h-14 items-center justify-center font-bold
        ${STATUS_COLORS[status] ?? "bg-white"}
        ${isSubmitted ? "text-white border-transparent" : "text-black"}
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
      h-14 font-bold cursor-pointer rounded text-sm
      ${STATUS_COLORS[status] ?? "bg-gray-200 hover:bg-gray-300"}
      ${status ? "text-white" : "text-black"}
      ${value == "Enter" || value == "⌫" ? "w-16" : "w-11"}
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
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  return ROWS.map((row, rowIndex) => (
    <div key={rowIndex} className="flex gap-1 justify-center">
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

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg">
      {message}
    </div>
  );
}

function Game() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState(() =>
    WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
  );
  const [toast, setToast] = useState("");
  const keyboardStatuses = getKeyboardStatuses(guesses, answer);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  }

  function handleReset() {
    setCurrentGuess("");
    setGuesses([]);
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase());
  }

  function handleInput(key) {
    if (key >= "0" && key <= "9") return;
    if (guesses.length >= MAX_GUESSES) return;
    if (guesses.at(-1) === answer) return;

    if (key === "Enter") {
      if (currentGuess.length === WORD_LENGTH) {
        if (!WORDS.includes(currentGuess.toLowerCase())) {
          showToast("Not a valid word");
          return;
        }
        const newGuesses = guesses.concat(currentGuess);
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (newGuesses.includes(answer)) {
          showToast(`You won in ${newGuesses.length} guesses!`);
        } else if (newGuesses.length === MAX_GUESSES) {
          showToast(`You lost! Word was ${answer}`);
        }
      }
    } else if (key === "Backspace" || key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev.concat(key));
      }
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.code.startsWith("Key") ? e.code.at(-1) : e.key;
      handleInput(key);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGuess, guesses]);

  function handleKeyClick(key) {
    handleInput(key);
  }

  return (
    <div className="flex flex-col items-center w-full gap-1 pt-4">
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

      <Toast message={toast} />
      {(guesses.includes(answer) || guesses.length === MAX_GUESSES) && (
        <button
          onClick={handleReset}
          className="mt-2 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
        >
          Play Again
        </button>
      )}

      <div className="flex flex-col gap-4 mt-6 mb-6">
        <Keyboard statuses={keyboardStatuses} handleKeyClick={handleKeyClick} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b border-gray-300 flex items-center justify-center py-3 mb-6">
        <h1 className="text-4xl font-bold font-ultra text-gray-800 tracking-wider">
          WORDLE
        </h1>
      </header>
      <Game />
    </div>
  );
}

export default App;
