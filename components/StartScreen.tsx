import { useState, useRef, useEffect } from "react";
import { Difficulty, Theme } from "@/types";
import { Upload, Loader2, Cloud, Images } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ImageSelector } from "./ImageSelector";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
        Memory Match
      </h1>
      <p className="text-gray-500 mb-8">Train your brain with a classic puzzle</p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Player Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Enter your name"
              required
            />
            <Cloud className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <p className="text-xs text-gray-400 text-right">Synced to Cloud ☁️</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDifficulty("4x4")}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficulty === "4x4"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <span className="block text-lg font-bold">4 × 4</span>
              <span className="text-xs opacity-75">Easy (16 tiles)</span>
              {highScores["4x4"].moves !== Infinity && (
                <span className="block text-xs font-medium text-indigo-500 mt-1">
                  Best: {highScores["4x4"].moves} moves
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("6x6")}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficulty === "6x6"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <span className="block text-lg font-bold">6 × 6</span>
              <span className="text-xs opacity-75">Hard (36 tiles)</span>
              {highScores["6x6"].moves !== Infinity && (
                <span className="block text-xs font-medium text-indigo-500 mt-1">
                  Best: {highScores["6x6"].moves} moves
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTheme(DEFAULT_THEME)}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                theme.id === 'default'
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
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
              className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                theme.id === 'custom'
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <Images size={18} />
              {customImages.length > 0 ? `${customImages.length} Selected` : "Manage Images"}
            </button>
          </div>
          
          {theme.id === 'custom' && (
            <p className="text-xs text-gray-500">
              {customImages.length} images selected. 
              {customImages.length < (difficulty === '4x4' ? 8 : 18) && (
                <span className="text-indigo-600 ml-1">
                  (Remaining tiles will use default icons)
                </span>
              )}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-[0.98]"
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
