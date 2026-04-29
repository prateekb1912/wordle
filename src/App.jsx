import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import socket from "./socket";
import HomeScreen from "./components/HomeScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import LobbyScreen from "./components/LobbyScreen.jsx";

function App() {
  const [screen, setScreen] = useState("home");
  const [roomState, setRoomState] = useState(null);
  const [roundWord, setRoundWord] = useState(null);

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

    return () => {
      socket.off("roundStarted");
      socket.off("roomUpdated");
      socket.off("connect");
    };
  }, []);

  if (screen == "game")
    return <GameScreen word={roundWord} roomCode={roomState.code} />;
  else if (screen == "home") return <HomeScreen />;
  else if (screen == "lobby")
    return <LobbyScreen room={roomState} socketId={socket.id} />;
}

export default App;
