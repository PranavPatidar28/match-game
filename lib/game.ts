import { Card, Difficulty } from '@/types';

// Fisher-Yates Shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// We will use indices 0-17 for the sprite sheet
export const SPRITE_INDICES = Array.from({ length: 18 }, (_, i) => i);

export function generateDeck(difficulty: Difficulty, customImages?: string[]): Card[] {
  const pairCount = difficulty === '4x4' ? 8 : 18;
  
  let selectedValues: string[] = [];

  if (customImages && customImages.length > 0) {
    // Use custom images
    // If we don't have enough custom images, we might need to cycle or error.
    // For MVP, assume we have enough or cycle.
    selectedValues = customImages.slice(0, pairCount);
    
    // If not enough, repeat
    while (selectedValues.length < pairCount) {
      selectedValues = [...selectedValues, ...customImages].slice(0, pairCount);
    }
  } else {
    // Use sprite indices
    const selectedIndices = SPRITE_INDICES.slice(0, pairCount);
    selectedValues = selectedIndices.map(i => i.toString());
  }
  
  const deck: Card[] = [];
  
  selectedValues.forEach((value) => {
    // Create two cards for each value
    deck.push({
      id: crypto.randomUUID(),
      value: value,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      id: crypto.randomUUID(),
      value: value,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(deck);
}
