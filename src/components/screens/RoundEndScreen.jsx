import socket from "../../socket";
import Leaderboard from "../Leaderboard";

export default function RoundEndScreen({ roundEnd, room, socketId }) {
  const leaderboard = roundEnd.leaderboard;
  const isHost = room.host == socketId;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Leaderboard leaderboard={leaderboard} />

      {isHost ? (
        <button
          className="w-full bg-accent text-white mt-2 py-3 rounded font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            socket.emit("startGame", { roomCode: room.code });
          }}
        >
          Next Round
        </button>
      ) : null}
    </div>
  );
}
