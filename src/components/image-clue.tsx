import { GAME_CONFIG } from "@/constants/gameConfig";

interface ImageClueProps {
  isVisible: boolean;
  imageUrl: string | null;
  characterName: string;
  position: { x: number; y: number } | null;
}

/**
 * Displays the image clue with zoom and blur effects
 * The image is zoomed to 2.5x and centered on a random position
 * determined by the character ID and current date
 */
export const ImageClue = ({
  isVisible,
  imageUrl,
  characterName,
  position
}: ImageClueProps) => {
  // Don't render if not visible or position not yet calculated
  if (!isVisible || !position || !imageUrl) return null;

  return (
    <div className="mt-4 flex justify-center">
      <div className="w-48 h-56 overflow-hidden rounded-lg bg-black">
        <img
          src={imageUrl}
          alt={characterName}
          style={
            {
              transformOrigin: `${position.x}% ${position.y}%`,
              transform: `scale(${GAME_CONFIG.IMAGE_ZOOM_SCALE})`,
              userSelect: "none",
              WebkitUserSelect: "none",
              filter: `blur(${GAME_CONFIG.IMAGE_BLUR_INTENSITY}px)`
            } as React.CSSProperties
          }
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default ImageClue;
