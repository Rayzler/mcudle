"use client";

import { useState, useEffect } from "react";
import { AiOutlineQuestion } from "react-icons/ai";
import { FaFire } from "react-icons/fa";
import HowToPlayModal from "./how-to-play-modal";
import {
  getStreakForMode,
  subscribeToStreakUpdates
} from "@/lib/streakService";
import { GameMode } from "@/constants/enums";

interface FloatingNavbarProps {
  gameMode?: GameMode;
}

/**
 * FloatingNavbar - Fixed floating navbar with streak and help button
 */
export const FloatingNavbar = ({
  gameMode = GameMode.CLASSIC
}: FloatingNavbarProps) => {
  const [showModal, setShowModal] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load streak on mount and listen for updates
  useEffect(() => {
    const currentStreak = getStreakForMode(gameMode);
    setStreak(currentStreak);

    // Subscribe to streak updates for this game mode
    const unsubscribe = subscribeToStreakUpdates((updatedGameMode) => {
      if (updatedGameMode === gameMode) {
        const newStreak = getStreakForMode(gameMode);
        setStreak(newStreak);
      }
    });

    return unsubscribe;
  }, [gameMode]);

  return (
    <>
      <div className="fixed top-6 right-6 flex gap-3 z-50">
        {/* Streak Display */}
        <div className="bg-neutral-800/25 backdrop-blur-md rounded-full p-3 border-2 border-white/75 shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow">
          <FaFire size={24} className="text-red-600" />
          <span className="text-white font-bold text-lg">{streak}</span>
        </div>

        {/* Help Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-neutral-800/25 backdrop-blur-md rounded-full p-3 border-2 border-white/75 shadow-lg hover:shadow-xl hover:border-red-600/75 transition-all duration-200 flex items-center justify-center"
          title="How to play"
        >
          <AiOutlineQuestion
            size={24}
            className="text-white hover:text-red-600 transition-colors"
          />
        </button>
      </div>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        gameMode={gameMode}
      />
    </>
  );
};

export default FloatingNavbar;
