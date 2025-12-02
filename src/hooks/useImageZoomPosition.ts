import { getUTCDate } from "@/lib/dateUtils";
import { useState, useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

/**
 * Custom hook to generate and cache deterministic random positions for image zoom
 * Uses character ID and today's date to ensure consistency across users and sessions
 * @param characterId - Unique character identifier
 * @returns Position object with x, y coordinates or null if not yet calculated
 */
export const useImageZoomPosition = (characterId: string): Position | null => {
  const [randomPosition, setRandomPosition] = useState<Position | null>(null);
  const positionRef = useRef<{ [key: string]: Position }>({});

  useEffect(() => {
    // Return cached position if available
    if (positionRef.current[characterId]) {
      setRandomPosition(positionRef.current[characterId]);
      return;
    }

    // Create a seed combining character ID and today's date for consistency across users
    const today = getUTCDate().toISOString().split("T")[0];
    const combinedSeed = `${characterId}-${today}`;
    const seed = combinedSeed
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Create two different pseudo-random values using sine function
    // This ensures different X and Y values while being deterministic
    const seededRandom1 = Math.sin(seed * 12.9898) * 43758.5453;
    const seededRandom2 = Math.sin((seed + 1) * 78.233) * 43758.5453;

    const position: Position = {
      x: Math.floor((seededRandom1 - Math.floor(seededRandom1)) * 100),
      y: Math.floor((seededRandom2 - Math.floor(seededRandom2)) * 100)
    };

    // Store in ref to avoid recalculation
    positionRef.current[characterId] = position;
    setRandomPosition(position);
  }, [characterId]);

  return randomPosition;
};
