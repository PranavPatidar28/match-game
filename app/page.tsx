"use client";

import { useGame } from "@/hooks/useGame";
import { StartScreen } from "@/components/StartScreen";
import { Board } from "@/components/Board";
import { HUD } from "@/components/HUD";
import { EndScreen } from "@/components/EndScreen";



export default function Home() {
  const { gameState, startGame, restartGame, goToMenu, handleCardClick, isLocked, mismatchedCards, highScores, isNewRecord } = useGame();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex flex-col items-center">
      {gameState.status === "idle" && (
        <StartScreen onStart={startGame} highScores={highScores} />
      )}

      {gameState.status === "playing" && (
        <>
          <HUD
            moves={gameState.moves}
            time={gameState.time}
            matches={gameState.matchesFound}
            totalPairs={gameState.cards.length / 2}
            onRestart={restartGame}
            onHome={goToMenu}
            playerName={gameState.playerName}
          />
          <Board
            cards={gameState.cards}
            onCardClick={handleCardClick}
            isLocked={isLocked}
            difficulty={gameState.difficulty}
            mismatchedCards={mismatchedCards}
          />
        </>
      )}

      {gameState.status === "won" && (
        <EndScreen gameState={gameState} onRestart={restartGame} onHome={goToMenu} isNewRecord={isNewRecord} />
      )}
    </main>
  );
}