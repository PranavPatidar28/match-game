import { useState, useEffect, useRef } from "react";
import { X, Upload, Check, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  selectedImages: string[];
  onSelectionChange: (images: string[]) => void;
}

interface UserUpload {
  id: string;
  url: string;
  created_at: string;
}

export function ImageSelector({
  isOpen,
  onClose,
  userId,
  selectedImages,
  onSelectionChange,
}: ImageSelectorProps) {
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUploads();
    }
  }, [isOpen, userId]);

  const fetchUploads = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_uploads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userId) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newUploads: UserUpload[] = [];

    try {
      for (const file of files) {
        // 1. Upload to Vercel Blob
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        });
        const newBlob = await response.json();

        // 2. Save to Supabase
        const { data, error } = await supabase
          .from("user_uploads")
          .insert({ user_id: userId, url: newBlob.url })
          .select()
          .single();

        if (error) throw error;
        if (data) newUploads.push(data);
      }

      setUploads((prev) => [...newUploads, ...prev]);
      
      // Auto-select new uploads
      const newUrls = newUploads.map(u => u.url);
      onSelectionChange([...selectedImages, ...newUrls]);

    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSelection = (url: string) => {
    if (selectedImages.includes(url)) {
      onSelectionChange(selectedImages.filter((img) => img !== url));
    } else {
      onSelectionChange([...selectedImages, url]);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // Note: We should also delete from Vercel Blob, but for MVP we'll just remove from DB
      const { error } = await supabase.from("user_uploads").delete().eq("id", id);
      if (error) throw error;

      setUploads((prev) => prev.filter((u) => u.id !== id));
      if (selectedImages.includes(url)) {
        onSelectionChange(selectedImages.filter((img) => img !== url));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;

    const imagesToDelete = uploads.filter(u => selectedImages.includes(u.url));
    const idsToDelete = imagesToDelete.map(u => u.id);

    try {
      const { error } = await supabase
        .from("user_uploads")
        .delete()
        .in("id", idsToDelete);

      if (error) throw error;

      setUploads((prev) => prev.filter((u) => !idsToDelete.includes(u.id)));
      onSelectionChange([]); // Clear selection after delete
    } catch (error) {
      console.error("Bulk delete failed", error);
      alert("Failed to delete images");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--foreground)]/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/40 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/20 flex items-center justify-between z-10 bg-white/30">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Manage Images</h2>
            <p className="text-sm text-[var(--foreground)]/60">
              Selected: <span className="font-bold text-[var(--color-primary)]">{selectedImages.length}</span> images
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/40 rounded-full transition-colors text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white/20">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-primary)]/40 bg-white/40 hover:bg-white/60 flex flex-col items-center justify-center gap-2 transition-all group"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
                ) : (
                  <>
                    <div className="p-3 bg-white/50 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-[var(--color-primary)]" size={24} />
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)]/80">Upload New</span>
                  </>
                )}
              </button>

              {/* Images */}
              {uploads.map((upload) => {
                const isSelected = selectedImages.includes(upload.url);
                return (
                  <div
                    key={upload.id}
                    className={cn(
                      "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm",
                      isSelected
                        ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 ring-offset-2 ring-offset-transparent"
                        : "border-white/40 hover:border-white/60"
                    )}
                    onClick={() => toggleSelection(upload.url)}
                  >
                    <img
                      src={upload.url}
                      alt="User upload"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection Indicator */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-sm",
                        isSelected
                          ? "bg-[var(--color-primary)] text-white scale-100"
                          : "bg-white/60 text-transparent border border-white/40 scale-90 group-hover:scale-100"
                      )}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 flex items-center justify-between gap-3 bg-white/30">
          <div>
            {selectedImages.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2.5 bg-red-500/10 text-red-600 font-semibold rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2 border border-red-500/20"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedImages.length})
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/40 text-[var(--foreground)] font-semibold rounded-xl hover:bg-white/60 transition-colors border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--gradient-button-from)] to-[var(--gradient-button-to)] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--gradient-button-from)]/20 transition-all active:scale-95"
            >
              Done ({selectedImages.length})
            </button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>
    </div>
  );
} 
