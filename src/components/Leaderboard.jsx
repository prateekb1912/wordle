export default function Leaderboard({ leaderboard }) {
  return (
    <div className="flex lg:flex-col gap-4 lg:gap-3 lg:w-44 lg:pt-2 order-first lg:order-last">
      <div className="hidden lg:flex px-4 text-muted text-xs uppercase tracking-wide">
        <span className="w-4 mr-4">#</span>
        <span className="flex-1">Player</span>
        <span>Score</span>
      </div>
      <div className="flex lg:flex-col gap-3 lg:gap-3 lg:w-44">
        {leaderboard.map((player, index) => (
          <div
            key={player.name}
            className="flex items-center gap-2 text-sm bg-surface border border-border rounded px-3 py-1"
          >
            <span className="text-muted w-4">{index + 1}</span>
            <span className="flex-1 px-6 py-3">{player.name}</span>
            <span className="font-bold">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
