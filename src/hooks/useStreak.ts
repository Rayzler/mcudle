import { useState, useEffect, useCallback } from "react";
import {
  updateStreakOnWin as updateService,
  getStreakForMode,
  subscribeToStreakUpdates
} from "@/lib/streakService";
import { GameMode } from "@/constants/enums";

/**
 * Custom hook to manage player streak
 * Provides functions and state to handle streak management
 */
export const useStreak = (gameMode: GameMode) => {
  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load streak on component mount and listen for changes
  useEffect(() => {
    setIsLoading(true);
    const currentStreak = getStreakForMode(gameMode);
    setStreak(currentStreak);
    setIsLoading(false);

    // Subscribe to streak updates
    const unsubscribe = subscribeToStreakUpdates((updatedGameMode) => {
      if (updatedGameMode === gameMode) {
        const newStreak = getStreakForMode(gameMode);
        setStreak(newStreak);
      }
    });

    return unsubscribe;
  }, [gameMode]);

  // Update streak when player wins
  const updateStreakOnWin = useCallback(() => {
    updateService(gameMode);
  }, [gameMode]);

  return {
    streak,
    updateStreakOnWin,
    isLoading
  };
};
