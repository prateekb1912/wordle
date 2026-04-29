import { useEffect, useState } from "react";
import socket from "../../socket";

function HomeScreen() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("error", (message) => setError(message));

    return () => {
      socket.off("error");
    };
  }, []);

  return (
    <div className="max-w-sm mx-auto px-4 py-8 flex flex-col gap-6">
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-border rounded px-4 py-2 bg-surface w-full outline-none"
      />

      <div className="border-t border-border" />

      <button
        disabled={!name.trim()}
        onClick={() => socket.emit("createRoom", { playerName: name })}
        className="w-full bg-accent text-white py-3 rounded font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Create Room
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-muted text-sm">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="border border-border rounded px-4 py-2 bg-surface flex-1 outline-none"
        />
        {name.trim() && (
          <button
            disabled={!name.trim() || !roomCode.trim()}
            onClick={() =>
              socket.emit("joinRoom", { roomCode, playerName: name })
            }
            className="bg-accent text-white px-5 rounded font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}

export default HomeScreen;
