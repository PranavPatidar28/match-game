import { useState, useRef, useEffect } from "react";
import { Difficulty, Theme } from "@/types";
import { Upload, Loader2, Cloud, Images } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ImageSelector } from "./ImageSelector";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface StartScreenProps {
  onStart: (name: string, difficulty: Difficulty, customImages?: string[]) => void;
  highScores: {
    "4x4": { moves: number; time: number };
    "6x6": { moves: number; time: number };
  };
}

const DEFAULT_THEME: Theme = { id: 'default', name: 'Default (Sprites)', type: 'sprite', src: '' };

export function StartScreen({ onStart, highScores }: StartScreenProps) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("4x4");
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  // Initialize User ID and Profile
  useEffect(() => {
    const initUser = async () => {
      let storedId = localStorage.getItem("memory_game_user_id");
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("memory_game_user_id", storedId);
      }
      setUserId(storedId);

      // Fetch profile and uploads
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", storedId)
          .single();

        if (profile?.username) {
          setName(profile.username);
        }

        // We don't need to fetch uploads here anymore, ImageSelector handles it.
        // But we might want to fetch them to check if user has ANY uploads to show "My Uploads" button state?
        // For now, let's just rely on the modal.
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    initUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && userId) {
      // Sync name to Supabase
      try {
        await supabase
          .from("profiles")
          .upsert({ id: userId, username: name.trim() });
      } catch (error) {
        console.error("Failed to sync profile", error);
      }

      onStart(name.trim(), difficulty, theme.type === 'custom' ? customImages : undefined);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md mx-auto p-8 glass-panel rounded-3xl animate-in fade-in zoom-in duration-500">
      <div className="mb-8 text-center w-full">
        
        <h1 className="text-5xl font-extrabold text-gradient mb-3 animate-[float_6s_ease-in-out_infinite]">
          Memory Match
        </h1>
        <p className="text-[var(--foreground)]/70 text-lg">Train your brain in style</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]/80 ml-1">
            Player Name
          </label>
          <div className="relative group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 pl-11 rounded-xl bg-white/60 border border-white/40 text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
              placeholder="Enter your name"
              required
            />
            <Cloud className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
          </div>
          <p className="text-xs text-[var(--foreground)]/60 text-right flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Synced to Cloud
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--foreground)]/80 ml-1">Difficulty</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDifficulty("4x4")}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                difficulty === "4x4"
                  ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--foreground)] shadow-[0_0_20px_var(--color-primary)]"
                  : "bg-white/40 border-white/40 text-[var(--foreground)]/60 hover:bg-white/60 hover:border-white/60"
              }`}
            >
              <span className="block text-2xl font-bold mb-1">4 × 4</span>
              <span className="text-xs opacity-75 font-medium">Easy (16 tiles)</span>
              {highScores["4x4"].moves !== Infinity && (
                <div className="mt-2 py-1 px-2 bg-white/50 rounded text-[10px] font-medium text-emerald-600 inline-block">
                  Best: {highScores["4x4"].moves}
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("6x6")}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                difficulty === "6x6"
                  ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--foreground)] shadow-[0_0_20px_var(--color-primary)]"
                  : "bg-white/40 border-white/40 text-[var(--foreground)]/60 hover:bg-white/60 hover:border-white/60"
              }`}
            >
              <span className="block text-2xl font-bold mb-1">6 × 6</span>
              <span className="text-xs opacity-75 font-medium">Hard (36 tiles)</span>
              {highScores["6x6"].moves !== Infinity && (
                <div className="mt-2 py-1 px-2 bg-white/50 rounded text-[10px] font-medium text-emerald-600 inline-block">
                  Best: {highScores["6x6"].moves}
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--foreground)]/80 ml-1">Tiles</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTheme(DEFAULT_THEME)}
              className={`flex-1 p-3.5 rounded-xl border transition-all duration-300 font-medium ${
                theme.id === 'default'
                  ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--foreground)] shadow-[0_0_20px_var(--color-primary)]"
                  : "bg-white/40 border-white/40 text-[var(--foreground)]/60 hover:bg-white/60 hover:border-white/60"
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme({ id: 'custom', name: 'Custom Uploads', type: 'custom', src: [] });
                setIsImageSelectorOpen(true);
              }}
              className={`flex-1 p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                theme.id === 'custom'
                  ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--foreground)] shadow-[0_0_20px_var(--color-primary)]"
                  : "bg-white/40 border-white/40 text-[var(--foreground)]/60 hover:bg-white/60 hover:border-white/60"
              }`}
            >
              <Images size={18} />
              {customImages.length > 0 ? `${customImages.length} Selected` : "Manage Images"}
            </button>
          </div>
          
          {theme.id === 'custom' && (
            <p className="text-xs text-[var(--foreground)]/60 ml-1">
              {customImages.length} images selected. 
              {customImages.length < (difficulty === '4x4' ? 8 : 18) && (
                <span className="text-[var(--color-primary)] ml-1">
                  (Remaining tiles will use default icons)
                </span>
              )}
            </p>
          )}

          <label className="block text-sm font-medium text-[var(--foreground)]/80 ml-1">Theme</label>
          <div className="flex justify-center mb-4">
          <ThemeSwitcher />
            </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 bg-gradient-to-r from-[var(--gradient-button-from)] to-[var(--gradient-button-to)] text-white font-bold rounded-xl shadow-lg hover:shadow-[var(--gradient-button-from)]/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Game
        </button>
      </form>

      <ImageSelector
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        userId={userId}
        selectedImages={customImages}
        onSelectionChange={setCustomImages}
      />
    </div>
  );
}
