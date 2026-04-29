import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socket from "../../socket";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Leaderboard from "../Leaderboard";

export default function LobbyScreen({ room, socketId }) {
  const roomCode = room.code;
  const isHost = room.host == socketId;
  const numPlayers = room.players.length;
  const leaderboard = room.players.map((p) => ({ name: p.name, score: 0 }));

  return (
    <div className="max-w-sm mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <span className="text-muted text-sm tracking-wide uppercase">
          Room Code
        </span>
        <span className="text-3xl font-bold tracking-widest">
          {roomCode}
          <button
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(roomCode);
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </span>
      </div>

      {isHost && (
        <button
          disabled={numPlayers <= 1}
          onClick={() => socket.emit("startGame", { roomCode })}
          className="w-full bg-accent text-white py-3 rounded font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Game
        </button>
      )}

      {!isHost && (
        <p className="text-center text-muted">Waiting for host to start...</p>
      )}
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-8">
        <Leaderboard leaderboard={leaderboard} />
      </div>
    </div>
  );
}
