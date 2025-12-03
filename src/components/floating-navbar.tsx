"use client";

import { useState } from "react";
import { AiOutlineQuestion } from "react-icons/ai";
import { FaFire } from "react-icons/fa";
import HowToPlayModal from "./how-to-play-modal";

/**
 * FloatingNavbar - Fixed floating navbar with streak and help button
 */
export const FloatingNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed top-6 right-6 flex gap-3 z-50">
        {/* Streak Display */}
        <div className="bg-neutral-800/25 backdrop-blur-md rounded-full p-3 border-2 border-white/75 shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow">
          <FaFire size={24} className="text-red-600" />
          <span className="text-white font-bold text-lg">0</span>
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
      <HowToPlayModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default FloatingNavbar;
