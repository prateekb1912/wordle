import { useState } from "react";
import socket from "../socket";

function HomeScreen() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          socket.emit("createRoom", { playerName: name });
        }}
      >
        Create Room
      </button>

      <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
      <button
        onClick={() => {
          socket.emit("joinRoom", { roomCode, playerName: name });
        }}
      >
        Join Room
      </button>
    </>
  );
}

export default HomeScreen;
