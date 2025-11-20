import { Card, Difficulty } from "@/types";
import { Tile } from "./Tile";
import { cn } from "@/lib/utils";

interface BoardProps {
  cards: Card[];
  difficulty: Difficulty;
  onCardClick: (card: Card) => void;
  isLocked: boolean;
  mismatchedCards: string[];
}

export function Board({ cards, difficulty, onCardClick, isLocked, mismatchedCards }: BoardProps) {
  return (
    <div
      className={cn(
        "grid gap-4 w-full max-w-2xl mx-auto p-4 animate-in fade-in zoom-in duration-700",
        difficulty === "4x4" ? "grid-cols-4" : "grid-cols-6"
      )}
    >
      {cards.map((card) => (
        <Tile
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={isLocked}
          isShaking={mismatchedCards.includes(card.id)}
        />
      ))}
    </div>
  );
}
