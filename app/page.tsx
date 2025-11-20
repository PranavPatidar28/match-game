"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { StartScreen } from "@/components/StartScreen";
import { Board } from "@/components/Board";
import { HUD } from "@/components/HUD";
import { EndScreen } from "@/components/EndScreen";
import { ExitConfirmDialog } from "@/components/ExitConfirmDialog";



export default function Home() {
  const { gameState, startGame, restartGame, goToMenu, handleCardClick, isLocked, mismatchedCards, highScores, isNewRecord } = useGame();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExitRequest = () => {
    setShowExitDialog(true);
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    goToMenu();
  };

  return (
    <main className="min-h-screen py-8 px-4 flex flex-col items-center">
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
            onHome={handleExitRequest}
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

      <ExitConfirmDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleExitConfirm}
        hasProgress={gameState.moves > 0}
      />
    </main>
  );
}