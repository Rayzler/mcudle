/**
 * useGameState - Custom hook for managing game state persistence
 * Abstracts game state loading, saving, and management for any game mode
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Character } from "@/types/prisma";
import { GameMode } from "@/constants/enums";
import {
  saveGameState,
  loadGameState,
  isGameStateSameDay,
  clearGameState,
  GameState
} from "@/lib/gameStateService";

export const useGameState = (gameMode: GameMode, characterId: string) => {
  // Game state
  const [attempts, setAttempts] = useState<Character[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialAttemptsCount = useRef(0);

  // Load game state from localStorage on mount
  useEffect(() => {
    const isSameDay = isGameStateSameDay(gameMode, characterId);
    if (isSameDay) {
      const savedState = loadGameState(gameMode);
      if (savedState) {
        setAttempts(savedState.attempts);
        setHasWon(savedState.hasWon);
        // Store how many attempts were loaded
        initialAttemptsCount.current = savedState.attempts.length;
      }
    }
    setIsLoaded(true);
  }, [gameMode, characterId]);

  // Save game state whenever it changes (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const gameState: GameState = {
      attempts,
      hasWon,
      characterId,
      savedAt: new Date().toISOString()
    };
    saveGameState(gameMode, gameState);
  }, [attempts, hasWon, characterId, gameMode, isLoaded]);

  // Callbacks for state updates
  const addAttempt = useCallback((character: Character) => {
    setAttempts((prevAttempts) => [character, ...prevAttempts]);
  }, []);

  const toggleQuote = useCallback(() => {
    setShowQuote((prev) => !prev);
    if (!showQuote) setShowImage(false);
  }, [showQuote]);

  const toggleImage = useCallback(() => {
    setShowImage((prev) => !prev);
    if (!showImage) setShowQuote(false);
  }, [showImage]);

  const win = useCallback(() => {
    setHasWon(true);
    clearGameState(gameMode);
  }, [gameMode]);

  const reset = useCallback(() => {
    setAttempts([]);
    setShowQuote(false);
    setShowImage(false);
    setHasWon(false);
    clearGameState(gameMode);
  }, [gameMode]);

  return {
    // State
    attempts,
    showQuote,
    showImage,
    hasWon,
    initialAttemptsCount: initialAttemptsCount.current,
    // Actions
    addAttempt,
    toggleQuote,
    toggleImage,
    win,
    reset
  };
};
