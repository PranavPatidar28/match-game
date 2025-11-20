export type Difficulty = '4x4' | '6x6';

export interface Card {
  id: string;
  value: string; // URL or identifier for the image
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  moves: number;
  time: number; // in seconds
  matchesFound: number;
  status: 'idle' | 'playing' | 'won';
  difficulty: Difficulty;
  playerName: string;
}

export interface GameHistory {
  date: string;
  moves: number;
  time: number;
  difficulty: Difficulty;
}

export type ThemeType = 'sprite' | 'custom';

export interface Theme {
  id: string;
  name: string;
  type: ThemeType;
  src: string | string[]; // Sprite URL or array of image URLs
}

export interface UITheme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
  gradients: {
    body: [string, string];
    button: [string, string];
    card: [string, string];
  };
}
