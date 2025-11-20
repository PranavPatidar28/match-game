import { useState, useRef } from "react";
import { Difficulty, Theme } from "@/types";
import { Upload, Loader2 } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });
        const newBlob = await response.json();
        uploadedUrls.push(newBlob.url);
      }
      setCustomImages(uploadedUrls);
      setTheme({ id: 'custom', name: 'Custom Uploads', type: 'custom', src: uploadedUrls });
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim(), difficulty, theme.type === 'custom' ? (theme.src as string[]) : undefined);
    }
  };

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
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="Enter your name"
            required
          />
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
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                theme.id === 'custom'
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              {customImages.length > 0 ? `${customImages.length} Images` : "Upload"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              multiple
              accept="image/*"
            />
          </div>
          {theme.id === 'custom' && customImages.length < 8 && (
            <p className="text-xs text-amber-600">
              Upload at least 8 images for 4x4 or 18 for 6x6.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!name.trim() || (theme.id === 'custom' && customImages.length === 0) || isUploading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-[0.98]"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
