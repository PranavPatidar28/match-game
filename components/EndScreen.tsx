import { GameState } from "@/types";
import { Confetti } from "./Confetti";

interface EndScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onHome: () => void;
  isNewRecord: boolean;
}

export function EndScreen({ gameState, onRestart, onHome, isNewRecord }: EndScreenProps) {
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
      <p className="text-gray-600 mb-8">
        You completed the {gameState.difficulty} puzzle in <span className="font-bold text-indigo-600">{gameState.moves} moves</span> and <span className="font-bold text-indigo-600">{gameState.time}s</span>.
      </p>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRestart}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
