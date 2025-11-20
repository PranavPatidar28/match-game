import { cn, formatTime } from "@/lib/utils";
import { RotateCcw, Home } from "lucide-react";

interface HUDProps {
  moves: number;
  time: number;
  matches: number;
  totalPairs: number;
  onRestart: () => void;
  onHome: () => void;
  playerName: string;
}

export function HUD({ moves, time, matches, totalPairs, onRestart, onHome, playerName }: HUDProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col sm:flex-row items-center justify-between glass-panel rounded-2xl mb-8 gap-4 animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--foreground)]/60 uppercase tracking-widest">Player</span>
          <span className="text-lg font-bold text-[var(--foreground)]">{playerName}</span>
        </div>
        <div className="h-8 w-px bg-[var(--foreground)]/20 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--foreground)]/60 uppercase tracking-widest">Moves</span>
          <span className="text-lg font-bold text-[var(--color-primary)]">{moves}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--foreground)]/60 uppercase tracking-widest">Time</span>
          <span className="text-lg font-bold text-[var(--color-primary)]">{formatTime(time)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--foreground)]/60 uppercase tracking-widest">Matches</span>
          <span className="text-lg font-bold text-emerald-600">{matches} / {totalPairs}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="glass-button p-2.5 rounded-xl flex items-center gap-2"
          title="Main Menu"
        >
          <Home size={18} />
          <span className="hidden sm:inline font-medium">Home</span>
        </button>

        <button
          onClick={onRestart}
          className="glass-button p-2.5 rounded-xl hover:bg-[var(--color-primary)]/20 flex items-center gap-2"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline font-medium">Restart</span>
        </button>
      </div>
    </div>
  );
}
