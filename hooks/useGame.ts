import { useState, useEffect, useCallback } from "react";
import { Card, Difficulty, GameState } from "@/types";
import { generateDeck } from "@/lib/game";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_KEY = "memory-game-state";
const HIGH_SCORES_KEY = "memory-game-high-scores";

interface HighScores {
  "4x4": { moves: number; time: number };
  "6x6": { moves: number; time: number };
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    moves: 0,
    time: 0,
    matchesFound: 0,
    status: "idle",
    difficulty: "4x4",
    playerName: "",
  });

  const [highScores, setHighScores] = useState<HighScores>({
    "4x4": { moves: Infinity, time: Infinity },
    "6x6": { moves: Infinity, time: Infinity },
  });

  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [mismatchedCards, setMismatchedCards] = useState<string[]>([]); // Store IDs of mismatched cards
  const [isLocked, setIsLocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Load from LocalStorage and Supabase on mount
  useEffect(() => {
    const loadGame = async () => {
      // 1. Load High Scores (Local Only for now)
      const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
      if (savedScores) {
        try {
          setHighScores(JSON.parse(savedScores));
        } catch (e) {
          console.error("Failed to load high scores", e);
        }
      }

      // 2. Load Game State
      // First check local storage for immediate feedback
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setGameState(parsed);
        } catch (e) {
          console.error("Failed to load local game state", e);
        }
      }

      // Then check Supabase if user is logged in
      const userId = localStorage.getItem("memory_game_user_id");
      if (userId) {
        try {
          const { data } = await supabase
            .from("game_progress")
            .select("state")
            .eq("user_id", userId)
            .single();

          if (data?.state) {
            // Optional: Conflict resolution strategy. For now, cloud wins if it exists.
            // Or prompt user? Let's just use cloud if it's playing.
            const cloudState = data.state as GameState;
            if (cloudState.status === 'playing') {
               setGameState(cloudState);
            }
          }
        } catch (error) {
          console.error("Failed to load cloud game state", error);
        }
      }
      
      setIsLoaded(true);
    };

    loadGame();
  }, []);

  // Save to LocalStorage and Supabase whenever state changes
  useEffect(() => {
    if (!isLoaded || gameState.status === "idle") return;

    // Local Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));

    // Cloud Save (Debounced)
    const userId = localStorage.getItem("memory_game_user_id");
    if (userId) {
      const saveToCloud = setTimeout(async () => {
        try {
          await supabase
            .from("game_progress")
            .upsert({ 
              user_id: userId, 
              state: gameState,
              updated_at: new Date().toISOString()
            });
        } catch (error) {
          console.error("Failed to save to cloud", error);
        }
      }, 2000); // Save every 2 seconds to avoid spamming

      return () => clearTimeout(saveToCloud);
    }
  }, [gameState, isLoaded]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.status === "playing") {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  const startGame = (name: string, difficulty: Difficulty, customImages?: string[]) => {
    const deck = generateDeck(difficulty, customImages);
    const newState: GameState = {
      cards: deck,
      moves: 0,
      time: 0,
      matchesFound: 0,
      status: "playing",
      difficulty,
      playerName: name,
    };
    setGameState(newState);
    setFlippedCards([]);
    setMismatchedCards([]);
    setIsLocked(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const restartGame = () => {
    startGame(gameState.playerName, gameState.difficulty);
  };

  const handleCardClick = useCallback((clickedCard: Card) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    setGameState((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      ),
    }));

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsLocked(true);
      setGameState((prev) => ({ ...prev, moves: prev.moves + 1 }));

      const [first, second] = newFlippedCards;
      
      if (first.value === second.value) {
        // Match found
        setTimeout(() => {
          setGameState((prev) => {
            const newMatches = prev.matchesFound + 1;
            const totalPairs = prev.cards.length / 2;
            const newStatus = newMatches === totalPairs ? "won" : "playing";
            
            if (newStatus === "won") {
              // Check for high score (prioritize moves, then time)
              const currentBest = highScores[prev.difficulty];
              const isBestMoves = prev.moves + 1 < currentBest.moves;
              const isBestTime = prev.moves + 1 === currentBest.moves && prev.time < currentBest.time;
              
              if (isBestMoves || (prev.moves + 1 === currentBest.moves && prev.time < currentBest.time)) {
                const newScores = {
                  ...highScores,
                  [prev.difficulty]: { moves: prev.moves + 1, time: prev.time }
                };
                setHighScores(newScores);
                localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(newScores));
                setIsNewRecord(true);
              } else {
                setIsNewRecord(false);
              }
            }
            
            return {
              ...prev,
              cards: prev.cards.map((card) =>
                card.value === first.value ? { ...card, isMatched: true, isFlipped: true } : card
              ),
              matchesFound: newMatches,
              status: newStatus,
            };
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setMismatchedCards([first.id, second.id]);
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            cards: prev.cards.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, isFlipped: false }
                : card
            ),
          }));
          setFlippedCards([]);
          setMismatchedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [flippedCards, isLocked, highScores]);

  const goToMenu = () => {
    setGameState(prev => ({ ...prev, status: "idle" }));
    setFlippedCards([]);
    setMismatchedCards([]);
    setIsLocked(false);
    
    // Clear cloud save on exit? Or keep it?
    // Let's keep it so they can resume later if they want.
    // But if they explicitly quit, maybe we should clear it?
    // For now, let's just set status to idle in local state.
  };

  return {
    gameState,
    startGame,
    restartGame,
    goToMenu,
    handleCardClick,
    isLocked,
    isLoaded,
    mismatchedCards,
    highScores,
    isNewRecord,
  };
}
