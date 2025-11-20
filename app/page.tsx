"use client";

import { useGame } from "@/hooks/useGame";
import { StartScreen } from "@/components/StartScreen";
import { Board } from "@/components/Board";
import { HUD } from "@/components/HUD";
import { EndScreen } from "@/components/EndScreen";

import { useSound } from "@/hooks/useSound";

export default function Home() {
  const { playSound, isMuted, toggleMute } = useSound();
  const { gameState, startGame, restartGame, handleCardClick, isLocked, mismatchedCards, highScores, isNewRecord } = useGame({ playSound });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex flex-col items-center">
      {gameState.status === "idle" && (
        <StartScreen onStart={startGame} highScores={highScores} />
      )}

      {gameState.status === "playing" && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in duration-500">
          <HUD
            moves={gameState.moves}
            time={gameState.time}
            matches={gameState.matchesFound}
            totalPairs={gameState.cards.length / 2}
            onRestart={restartGame}
            playerName={gameState.playerName}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
          <Board
            cards={gameState.cards}
            difficulty={gameState.difficulty}
            onCardClick={handleCardClick}
            isLocked={isLocked}
            mismatchedCards={mismatchedCards}
          />
        </div>
      )}

      {gameState.status === "won" && (
        <EndScreen gameState={gameState} onRestart={restartGame} isNewRecord={isNewRecord} />
      )}
    </main>
  );
}