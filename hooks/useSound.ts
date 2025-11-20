import { useState, useEffect, useCallback } from 'react';

type SoundType = 'flip' | 'match' | 'mismatch' | 'win';

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const savedMute = localStorage.getItem('memory-game-muted');
    if (savedMute) {
      setIsMuted(JSON.parse(savedMute));
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      localStorage.setItem('memory-game-muted', JSON.stringify(newVal));
      return newVal;
    });
  };

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;

    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.5;
    
    // Play and catch errors (e.g., user hasn't interacted yet)
    audio.play().catch((e) => {
      console.warn('Audio play failed', e);
    });
  }, [isMuted]);

  return { isMuted, toggleMute, playSound };
}
