import socket from "../socket";

export default function RoundEndScreen({ roundEnd, room, socketId }) {
  const word = roundEnd.word;
  const leaderboard = roundEnd.leaderboard;
  const isHost = room.host == socketId;

  return (
    <>
      <div> {word} </div>
      <div>
        <ul>
          {leaderboard.map(({ name, score }) => (
            <li key={name}>
              {name} {score}
            </li>
          ))}
        </ul>
      </div>
      {isHost ? (
        <button
          onClick={() => {
            socket.emit("startGame", { roomCode: room.code });
          }}
        >
          {" "}
          Next Round{" "}
        </button>
      ) : null}
    </>
  );
}
