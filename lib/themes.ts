import { UITheme } from '@/types';

export const THEMES: Record<string, UITheme> = {
  lavender: {
    id: 'lavender',
    name: 'Lavender Dreams',
    colors: {
      background: '#F4EEFF',
      foreground: '#424874',
      primary: '#A6B1E1',
      secondary: '#DCD6F7',
      accent: '#424874',
      surface: '#F4EEFF',
    },
    gradients: {
      body: ['#A6B1E1', '#F4EEFF'],
      button: ['#424874', '#A6B1E1'],
      card: ['#424874', '#A6B1E1'],
    },
  },
  summer: {
    id: 'summer',
    name: 'Summer Breeze',
    colors: {
      background: '#EAFFD0',
      foreground: '#2D3748',
      primary: '#F38181',
      secondary: '#95E1D3',
      accent: '#FCE38A',
      surface: '#EAFFD0',
    },
    gradients: {
      body: ['#F38181', '#EAFFD0'],
      button: ['#F38181', '#FCE38A'],
      card: ['#F38181', '#FCE38A'],
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Nights',
    colors: {
      background: '#410445',
      foreground: '#fef3c7',
      primary: '#FF2DF1',
      secondary: '#A5158C',
      accent: '#F6DC43',
      surface: '#5a0660',
    },
    gradients: {
      body: ['#A5158C', '#410445'],
      button: ['#A5158C', '#FF2DF1'],
      card: ['#A5158C', '#FF2DF1'],
    },
  },
};

export const DEFAULT_THEME_ID = 'lavender';
