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
    // Use custom images first, then fill with default sprites
    const totalSprites = 16;
    
    // 1. Take as many custom images as we have (up to pairCount)
    const customSubset = customImages.slice(0, pairCount);
    
    // 2. If we need more, fill with sprite indices
    const remainingCount = pairCount - customSubset.length;
    let defaultSubset: string[] = [];
    
    if (remainingCount > 0) {
      defaultSubset = Array.from({ length: remainingCount }, (_, i) => (i % totalSprites).toString());
    }
    
    selectedValues = [...customSubset, ...defaultSubset];
  } else {
    // Use sprite indices (0-15 for 4x4 sheet)
    // For 6x6 (18 pairs), we need to reuse 2 sprites
    const totalSprites = 16;
    selectedValues = Array.from({ length: pairCount }, (_, i) => (i % totalSprites).toString());
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
