export default function Header() {
  return (
    <header className="w-full border-b border-border py-4 mb-8">
      <h1 className="text-3xl font-bold tracking-widest text-center">WORDLE</h1>
      {/* {!isMultiplayer && (
        <button
          onClick={handleShare}
          className="absolute right-4 px-2 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 text-xs cursor-pointer"
        >
          Challenge
        </button>
      )} */}
    </header>
  );
}
