import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import socket from "./socket";
import HomeScreen from "./components/screens/HomeScreen.jsx";
import GameScreen from "./components/screens/GameScreen.jsx";
import LobbyScreen from "./components/screens/LobbyScreen.jsx";
import RoundEndScreen from "./components/screens/RoundEndScreen.jsx";
import GameEndScreen from "./components/screens/GameEndScreen.jsx";

function App() {
  const [screen, setScreen] = useState("home");
  const [roomState, setRoomState] = useState(null);
  const [roundWord, setRoundWord] = useState(null);
  const [roundEnd, setRoundEnd] = useState(null);

  function renderScreen() {
    if (screen == "game")
      return (
        <GameScreen
          word={roundWord}
          roomCode={roomState.code}
          isMultiplayer={true}
        />
      );
    else if (screen == "home") return <HomeScreen />;
    else if (screen == "lobby")
      return <LobbyScreen room={roomState} socketId={socket.id} />;
    else if (screen == "roundEnd")
      return (
        <RoundEndScreen
          roundEnd={roundEnd}
          room={roomState}
          socketId={socket.id}
        />
      );
    else if (screen == "gameEnd")
      return <GameEndScreen roundEnd={roundEnd} room={roomState} />;
  }

  useEffect(() => {
    socket.on("connect", () => console.log("connected:", socket.id));
    socket.on("roomUpdated", (room) => {
      setRoomState(room);
      setScreen("lobby");
    });
    socket.on("roundStarted", ({ word, round }) => {
      setScreen("game");
      setRoundWord(word);
    });
    socket.on("roundEnded", ({ word, leaderboard }) => {
      setRoundEnd({ word, leaderboard });
      setScreen("roundEnd");
    });
    socket.on("gameOver", ({ leaderboard }) => {
      setRoundEnd({ roundWord, leaderboard });
      setScreen("gameEnd");
    });

    return () => {
      socket.off("gameOver");
      socket.off("roundEnded");
      socket.off("roundStarted");
      socket.off("roomUpdated");
      socket.off("connect");
    };
  }, []);

  return <div className="min-h-screen bg-bg text-text">{renderScreen()}</div>;
}

export default App;
