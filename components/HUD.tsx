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
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 mb-6 gap-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</span>
          <span className="text-lg font-bold text-gray-800">{playerName}</span>
        </div>
        <div className="h-8 w-px bg-gray-200 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Moves</span>
          <span className="text-lg font-bold text-indigo-600">{moves}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</span>
          <span className="text-lg font-bold text-indigo-600">{formatTime(time)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Matches</span>
          <span className="text-lg font-bold text-green-600">{matches} / {totalPairs}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          title="Main Menu"
        >
          <Home size={18} />
          <span className="hidden sm:inline">Home</span>
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </div>
  );
}
