/**
 * Streak service - Manages game streaks in localStorage
 * Follows the project's architecture and patterns
 */

import { GameMode } from "@/constants/enums";

export type StreakData = {
  [key in GameMode]: {
    current: number;
    lastPlayedDate: string;
    bestStreak: number;
    totalWins: number;
  };
};

const STORAGE_KEY = "mcu-dle-streaks";

// Custom event for streak updates (same-page synchronization)
type StreakUpdateListener = (gameMode: GameMode) => void;
const streakUpdateListeners: StreakUpdateListener[] = [];

export const subscribeToStreakUpdates = (
  listener: StreakUpdateListener
): (() => void) => {
  streakUpdateListeners.push(listener);
  return () => {
    const index = streakUpdateListeners.indexOf(listener);
    if (index > -1) {
      streakUpdateListeners.splice(index, 1);
    }
  };
};

const notifyStreakUpdate = (gameMode: GameMode) => {
  streakUpdateListeners.forEach((listener) => listener(gameMode));
};

/**
 * Get current streak data from localStorage
 */
export const getStreakData = (): StreakData => {
  if (typeof window === "undefined") return getDefaultStreakData();

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultStreakData();
  } catch (error) {
    console.error("Error reading streak data:", error);
    return getDefaultStreakData();
  }
};

/**
 * Get default streak data structure
 */
const getDefaultStreakData = (): StreakData => ({
  [GameMode.CLASSIC]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  },
  [GameMode.MOVIE]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  },
  [GameMode.IMAGE]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  },
  [GameMode.QUOTE]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  },
  [GameMode.ITEM]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  },
  [GameMode.EMOJI]: {
    current: 0,
    lastPlayedDate: "",
    bestStreak: 0,
    totalWins: 0
  }
});

/**
 * Save streak data to localStorage
 */
const saveStreakData = (data: StreakData, notifyGameMode?: GameMode): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (notifyGameMode) {
      notifyStreakUpdate(notifyGameMode);
    }
  } catch (error) {
    console.error("Error saving streak data:", error);
  }
};

/**
 * Get today's date in UTC format (YYYY-MM-DD)
 */
const getTodayUTC = (): string => {
  const now = new Date();
  const utcDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  return utcDate.toISOString().split("T")[0];
};

/**
 * Update streak after a win
 */
export const updateStreakOnWin = (gameMode: GameMode): void => {
  const data = getStreakData();
  const today = getTodayUTC();
  const modeData = data[gameMode];
  const lastPlayed = modeData.lastPlayedDate;

  // Check if player already won today
  if (lastPlayed === today) {
    return;
  }

  // Check if streak should continue or reset
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastPlayed === yesterdayStr) {
    // Streak continues
    modeData.current += 1;
  } else {
    // Streak resets or starts
    modeData.current = 1;
  }

  // Update best streak
  if (modeData.current > modeData.bestStreak) {
    modeData.bestStreak = modeData.current;
  }

  // Update total wins and last played date
  modeData.totalWins += 1;
  modeData.lastPlayedDate = today;

  saveStreakData(data, gameMode);
};

/**
 * Get streak for a specific game mode
 */
export const getStreakForMode = (gameMode: GameMode): number => {
  const data = getStreakData();
  const today = getTodayUTC();
  const modeData = data[gameMode];

  // Reset streak if last played was more than 1 day ago
  if (modeData.lastPlayedDate) {
    const lastPlayed = new Date(modeData.lastPlayedDate);
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (
      modeData.lastPlayedDate !== today &&
      modeData.lastPlayedDate !== yesterdayStr
    ) {
      return 0;
    }
  }

  return modeData.current;
};

/**
 * Get all stats for a specific game mode
 */
export const getStatsForMode = (gameMode: GameMode) => {
  const data = getStreakData();
  return data[gameMode];
};

/**
 * Get all streaks data
 */
export const getAllStreaks = (): StreakData => {
  return getStreakData();
};

/**
 * Reset streak for a specific mode (admin/dev only)
 */
export const resetStreakForMode = (gameMode: GameMode): void => {
  const data = getStreakData();
  data[gameMode] = {
    current: 0,
    lastPlayedDate: "",
    bestStreak: data[gameMode].bestStreak, // Keep best streak
    totalWins: data[gameMode].totalWins
  };
  saveStreakData(data);
};

/**
 * Clear all streak data (admin/dev only)
 */
export const clearAllStreaks = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing streak data:", error);
  }
};
