import socket from "../socket";

export default function LobbyScreen({ room, socketId }) {
  const roomCode = room.code;
  const playersList = room.players.map((player) => (
    <li key={player.id}> {player.name} </li>
  ));
  const isHost = room.host == socketId;

  return (
    <div>
      <div> {roomCode} </div>
      <ul>{playersList}</ul>
      <button onClick={() => socket.emit("startGame", { roomCode })}>
        {isHost ? "Start Game" : ""}
      </button>
    </div>
  );
}
