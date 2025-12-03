/**
 * Game Mode Enum - Represents all available game modes
 */
export enum GameMode {
  CLASSIC = "classic",
  MOVIE = "movie",
  IMAGE = "image",
  QUOTE = "quote",
  ITEM = "item",
  EMOJI = "emoji"
}

/**
 * Clue Type Enum - Represents types of clues available
 */
export enum ClueType {
  QUOTE = "Quote",
  IMAGE = "Image"
}

/**
 * Helper function to get all game modes
 */
export const getAllGameModes = (): GameMode[] => {
  return Object.values(GameMode);
};

/**
 * Helper function to convert GameMode enum to string
 */
export const getGameModeLabel = (mode: GameMode): string => {
  const labels: Record<GameMode, string> = {
    [GameMode.CLASSIC]: "Classic",
    [GameMode.MOVIE]: "Movie",
    [GameMode.IMAGE]: "Image",
    [GameMode.QUOTE]: "Quote",
    [GameMode.ITEM]: "Item",
    [GameMode.EMOJI]: "Emoji"
  };
  return labels[mode];
};
