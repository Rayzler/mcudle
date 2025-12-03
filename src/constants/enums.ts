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
 * Game State Key Enum - Storage keys for game state by mode
 */
export enum GameStateKey {
  CLASSIC_STATE = "mcu-dle-game-state-classic",
  MOVIE_STATE = "mcu-dle-game-state-movie",
  IMAGE_STATE = "mcu-dle-game-state-image",
  QUOTE_STATE = "mcu-dle-game-state-quote",
  ITEM_STATE = "mcu-dle-game-state-item",
  EMOJI_STATE = "mcu-dle-game-state-emoji"
}

/**
 * Helper function to get game state key for a game mode
 */
export const getGameStateKey = (mode: GameMode): GameStateKey => {
  const keyMap: Record<GameMode, GameStateKey> = {
    [GameMode.CLASSIC]: GameStateKey.CLASSIC_STATE,
    [GameMode.MOVIE]: GameStateKey.MOVIE_STATE,
    [GameMode.IMAGE]: GameStateKey.IMAGE_STATE,
    [GameMode.QUOTE]: GameStateKey.QUOTE_STATE,
    [GameMode.ITEM]: GameStateKey.ITEM_STATE,
    [GameMode.EMOJI]: GameStateKey.EMOJI_STATE
  };
  return keyMap[mode];
};

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
