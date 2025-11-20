'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UITheme } from '@/types';
import { THEMES, DEFAULT_THEME_ID } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: UITheme;
  setTheme: (themeId: string) => void;
  availableThemes: UITheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<UITheme>(THEMES[DEFAULT_THEME_ID]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('ui-theme');
    if (savedThemeId && THEMES[savedThemeId]) {
      setCurrentTheme(THEMES[savedThemeId]);
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--background', currentTheme.colors.background);
    root.style.setProperty('--foreground', currentTheme.colors.foreground);
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);
    root.style.setProperty('--color-surface', currentTheme.colors.surface);

    // Apply gradient variables (2 colors only)
    root.style.setProperty('--gradient-body-from', currentTheme.gradients.body[0]);
    root.style.setProperty('--gradient-body-to', currentTheme.gradients.body[1]);
    
    root.style.setProperty('--gradient-button-from', currentTheme.gradients.button[0]);
    root.style.setProperty('--gradient-button-to', currentTheme.gradients.button[1]);
    
    root.style.setProperty('--gradient-card-from', currentTheme.gradients.card[0]);
    root.style.setProperty('--gradient-card-to', currentTheme.gradients.card[1]);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    if (THEMES[themeId]) {
      setCurrentTheme(THEMES[themeId]);
      localStorage.setItem('ui-theme', themeId);
    }
  };

  const availableThemes = Object.values(THEMES);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
