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
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-8 glass-panel rounded-3xl text-center animate-in fade-in zoom-in duration-500">
      <Confetti />
      <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mb-6 relative shadow-lg shadow-[var(--color-primary)]/30 animate-[pulse-glow_2s_infinite]">
        <span className="text-5xl">🎉</span>
        {isNewRecord && (
          <div className="absolute -top-3 -right-3 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce border-2 border-white/50">
            NEW RECORD!
          </div>
        )}
      </div>
      
      <h2 className="text-4xl font-bold text-[var(--foreground)] mb-2">Great Job!</h2>
      <p className="text-xl text-[var(--color-primary)] font-medium mb-2">{gameState.playerName}</p>
      
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-white/60 rounded-xl p-3 border border-white/40">
          <p className="text-xs text-[var(--foreground)]/60 uppercase tracking-wider">Moves</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{gameState.moves}</p>
        </div>
        <div className="bg-white/60 rounded-xl p-3 border border-white/40">
          <p className="text-xs text-[var(--foreground)]/60 uppercase tracking-wider">Time</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{gameState.time}s</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-[var(--gradient-button-from)] to-[var(--gradient-button-to)] text-white font-bold rounded-xl shadow-lg hover:shadow-[var(--gradient-button-from)]/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Play Again
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 bg-white/50 hover:bg-white/70 text-[var(--foreground)] font-bold rounded-xl border border-white/40 transition-all"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
