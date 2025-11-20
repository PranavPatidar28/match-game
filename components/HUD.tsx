import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface HUDProps {
  moves: number;
  time: number;
  matches: number;
  totalPairs: number;
  onRestart: () => void;
  playerName: string;
  isMuted: boolean;
  toggleMute: () => void;
}

export function HUD({ moves, time, matches, totalPairs, onRestart, playerName, isMuted, toggleMute }: HUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
          onClick={toggleMute}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button
          onClick={onRestart}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg active:scale-95 transform duration-100"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
