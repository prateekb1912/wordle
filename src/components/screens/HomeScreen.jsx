import { useState } from "react";
import socket from "../../socket";
import Header from "../Header";

function HomeScreen() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="max-w-sm mx-auto px-4 py-16 flex flex-col gap-8">
      <Header />

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-border rounded px-4 py-2 bg-surface text-text w-full outline-none"
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={() => socket.emit("createRoom", { playerName: name })}
          className="w-full bg-accent text-white py-3 rounded font-bold tracking-wide"
        >
          Create Room
        </button>

        <div className="flex gap-2">
          <input
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="border border-border rounded px-4 py-2 bg-surface text-text flex-1 outline-none"
          />
          <button
            onClick={() =>
              socket.emit("joinRoom", { roomCode, playerName: name })
            }
            className="bg-accent text-white px-4 py-2 rounded font-bold"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
