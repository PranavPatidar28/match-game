import { Card } from "@/types";
import { cn } from "@/lib/utils";

interface TileProps {
  card: Card;
  onClick: (card: Card) => void;
  disabled?: boolean;
  isShaking?: boolean;
}

export function Tile({ card, onClick, disabled, isShaking }: TileProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Calculate sprite position
  // Assuming 4x4 sprite sheet (16 icons) or 5x4 for 18 icons?
  // Let's assume the generated image is a 4x4 grid (16 icons).
  // For 6x6 board we need 18 pairs.
  // If we only have 16 icons, we might need to reuse some or handle it.
  // Let's assume we have enough or we cycle.
  
  const index = parseInt(card.value, 10);
  const cols = 4;
  const rows = 5; // Assume we might have more rows if needed, but let's stick to 4x4 for now.
  // If index > 15, we might run out of sprites in a 4x4 grid.
  // For the MVP, let's just modulo 16 if we go over, or hope the user plays 4x4 mostly.
  // Or better, we use CSS background-position.
  
  // Each sprite is 25% width and 25% height of the image (for 4x4 grid).
  const x = (index % cols) * 100 / (cols - 1); // 0, 33.3, 66.6, 100? No.
  // background-position percentages are tricky.
  // If we have 4 columns, the positions are 0%, 33.33%, 66.66%, 100%.
  
  // Let's try a different approach: object-view-box (modern) or just a div with background-image.
  // Div with background-image is safest.
  
  const colIndex = index % cols;
  const rowIndex = Math.floor(index / cols);
  
  // Assuming 256x256 sprites in a 1024x1024 image
  const bgSize = "400%"; // 4 columns means the image is 400% the size of the container
  const bgPosX = `${colIndex * (100 / (cols - 1))}%`;
  const bgPosY = `${rowIndex * (100 / (cols - 1))}%`;

  return (
    <div
      className={cn(
        "relative aspect-square cursor-pointer perspective-1000 group transition-transform duration-300",
        (card.isFlipped || card.isMatched) && "pointer-events-none",
        isShaking && "animate-shake"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled || card.isFlipped || card.isMatched ? -1 : 0}
      aria-label={`Card ${card.isFlipped || card.isMatched ? "revealed" : "hidden"}`}
    >
      <div
        className={cn(
          "w-full h-full transition-all duration-500 transform-style-3d shadow-xl",
          (card.isFlipped || card.isMatched) ? "rotate-y-180" : "group-hover:scale-[1.05]"
        )}
      >
        {/* Front (Hidden state) */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] rounded-xl shadow-inner border border-white/20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-2xl font-bold text-white/80">?</span>
          </div>
        </div>

        {/* Back (Revealed state) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-[var(--color-primary)]/30 flex items-center justify-center p-3">
          {(card.value || '').startsWith('http') || (card.value || '').startsWith('/') ? (
             // Custom Image
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={card.value} 
               alt="Card" 
               className="w-full h-full object-contain drop-shadow-md"
             />
          ) : (
            // Fantasy Sprite Sheet
            <div 
              className="w-full h-full filter drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]"
              style={{
                backgroundImage: "url('/images/fantasy_sprites.png')",
                backgroundSize: "400% 400%",
                backgroundPosition: `${(parseInt(card.value) % 4) * (100 / 3)}% ${Math.floor(parseInt(card.value) / 4) * (100 / 3)}%`,
                backgroundRepeat: "no-repeat"
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
