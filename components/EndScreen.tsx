import { GameState } from "@/types";
import { Confetti } from "./Confetti";

interface EndScreenProps {
  gameState: GameState;
  onRestart: () => void;
  isNewRecord: boolean;
}

export function EndScreen({ gameState, onRestart, isNewRecord }: EndScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
      <Confetti />
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
        <span className="text-4xl">🎉</span>
        {isNewRecord && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">
            NEW RECORD!
          </div>
        )}
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Great Job, {gameState.playerName}!</h2>
      <p className="text-gray-500 mb-8">You completed the {gameState.difficulty} board.</p>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-gray-50 p-4 rounded-2xl">
          <span className="block text-sm text-gray-500 mb-1">Time</span>
          <span className="block text-2xl font-bold text-gray-800">{gameState.time}s</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl">
          <span className="block text-sm text-gray-500 mb-1">Moves</span>
          <span className="block text-2xl font-bold text-gray-800">{gameState.moves}</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
      >
        Play Again
      </button>
    </div>
  );
}
