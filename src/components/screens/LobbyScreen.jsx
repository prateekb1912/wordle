import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socket from "../../socket";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function LobbyScreen({ room, socketId }) {
  const roomCode = room.code;
  const isHost = room.host == socketId;

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

      <div className="flex flex-col gap-2">
        <span className="text-muted text-sm uppercase tracking-wide">
          Players
        </span>
        {room.players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between  bg-surface border border-border drop-shadow-md rounded px-4 py-4"
          >
            <span> {player.name} </span>
            <span> {player.score} </span>
          </div>
        ))}
      </div>

      {isHost && (
        <button
          onClick={() => socket.emit("startGame", { roomCode })}
          className="w-full bg-accent text-white py-3 rounded font-bold tracking-wide"
        >
          Start Game
        </button>
      )}

      {!isHost && (
        <p className="text-center text-muted">Waiting for host to start...</p>
      )}
    </div>
  );
}
