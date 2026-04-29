export default function GameEndScreen({ roundEnd, room }) {
  const leaderboard = roundEnd.leaderboard;
  const winningPlayer = leaderboard[0].name;

  return (
    <>
      <div>
        <ul>
          {leaderboard.map(({ name, score }) => (
            <li key={name}>
              {name} {score}
            </li>
          ))}
        </ul>
      </div>
      <div>Winner - {winningPlayer}</div>
    </>
  );
}
