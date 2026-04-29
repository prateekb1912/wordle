import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socket from "../../socket";
import Leaderboard from "../Leaderboard";
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons";

export default function GameEndScreen({ roundEnd, room }) {
  const leaderboard = roundEnd.leaderboard;
  const winningPlayer = leaderboard[0].name;

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-4 py-8">
      <Leaderboard leaderboard={leaderboard} />
      <div className="px-2 py-2 text-2xl text-center">
        Winner - <span className="font-bold"> {winningPlayer} </span>
        <FontAwesomeIcon icon={faHandsClapping} />
      </div>
      <button
        className="w-full bg-accent text-white mt-2 py-3 rounded font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          socket.emit("resetRoom", { roomCode: room.code });
        }}
      >
        Play Again
      </button>
    </div>
  );
}
