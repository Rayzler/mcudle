import { useState, useEffect, useCallback } from "react";
import {
  updateStreakOnWin as updateService,
  getStreakForMode,
  subscribeToStreakUpdates
} from "@/lib/streakService";
import { GameMode } from "@/constants/enums";

/**
 * Hook personalizado para manejar la racha del jugador
 * Provee funciones y estado para gestionar la racha
 */
export const useStreak = (gameMode: GameMode) => {
  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar racha al montar el componente y escuchar cambios
  useEffect(() => {
    setIsLoading(true);
    const currentStreak = getStreakForMode(gameMode);
    setStreak(currentStreak);
    setIsLoading(false);

    // Suscribirse a actualizaciones de racha
    const unsubscribe = subscribeToStreakUpdates((updatedGameMode) => {
      if (updatedGameMode === gameMode) {
        const newStreak = getStreakForMode(gameMode);
        setStreak(newStreak);
      }
    });

    return unsubscribe;
  }, [gameMode]);

  // Actualizar racha cuando el jugador gana
  const updateStreakOnWin = useCallback(() => {
    updateService(gameMode);
  }, [gameMode]);

  return {
    streak,
    updateStreakOnWin,
    isLoading
  };
};
