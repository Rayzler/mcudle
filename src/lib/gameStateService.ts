/**
 * Game State Service - Manages game session state persistence
 * Allows players to resume games in progress from the same day
 */

import { Character } from "@/types/prisma";
import { GameMode, getGameStateKey } from "@/constants/enums";

export interface GameState {
  attempts: Character[];
  showQuote: boolean;
  showImage: boolean;
  hasWon: boolean;
  characterId: string;
  savedAt: string; // ISO timestamp
}

/**
 * Save game state for a specific game mode
 */
export const saveGameState = (gameMode: GameMode, state: GameState): void => {
  if (typeof window === "undefined") return;

  try {
    const key = getGameStateKey(gameMode);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving game state for ${gameMode}:`, error);
  }

  console.log(`Game state saved for ${gameMode}:`, state);
};

/**
 * Load game state for a specific game mode
 */
export const loadGameState = (gameMode: GameMode): GameState | null => {
  if (typeof window === "undefined") return null;

  try {
    const key = getGameStateKey(gameMode);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading game state for ${gameMode}:`, error);
    return null;
  }
};

/**
 * Check if a saved game state is for the same day and character
 */
export const isGameStateSameDay = (
  gameMode: GameMode,
  currentCharacterId: string
): boolean => {
  const state = loadGameState(gameMode);
  if (!state) return false;

  const savedDate = new Date(state.savedAt).toDateString();
  const today = new Date().toDateString();

  // State is valid if from today and for the same character
  return savedDate === today && state.characterId === currentCharacterId;
};

/**
 * Clear game state for a specific mode
 */
export const clearGameState = (gameMode: GameMode): void => {
  if (typeof window === "undefined") return;

  try {
    const key = getGameStateKey(gameMode);
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing game state for ${gameMode}:`, error);
  }
};

/**
 * Clear all game states (admin/dev only)
 */
export const clearAllGameStates = (): void => {
  if (typeof window === "undefined") return;

  try {
    Object.values(GameMode).forEach((mode) => {
      clearGameState(mode as GameMode);
    });
  } catch (error) {
    console.error("Error clearing all game states:", error);
  }
};
