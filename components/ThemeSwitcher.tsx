'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex gap-2">
      {availableThemes.map((theme) => {
        const isActive = currentTheme.id === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => setTheme(theme.id)}
            className={`group relative px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive
                ? 'bg-white/80 scale-105 shadow-lg'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            title={theme.name}
          >
            <div className="flex items-center gap-2">
              {/* Color preview dots */}
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
              </div>
              
              {/* Theme name */}
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {theme.name.split(' ')[0]}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <Check size={14} className="text-[var(--color-primary)]" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
