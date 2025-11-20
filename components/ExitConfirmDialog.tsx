'use client';

import { X } from 'lucide-react';

interface ExitConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasProgress: boolean;
}

export function ExitConfirmDialog({ isOpen, onClose, onConfirm, hasProgress }: ExitConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--foreground)]/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-300 border border-white/40 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Exit Game?</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/40 rounded-full transition-colors text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="text-[var(--foreground)]/80 mb-6">
          {hasProgress 
            ? "Your progress will be saved and you can resume later."
            : "Return to main menu?"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/40 text-[var(--foreground)] font-semibold rounded-xl hover:bg-white/60 transition-colors border border-white/20"
          >
            Continue Playing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--gradient-button-from)] to-[var(--gradient-button-to)] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--gradient-button-from)]/20 transition-all active:scale-95"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
