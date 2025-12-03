"use client";

import { IoClose } from "react-icons/io5";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HowToPlayModal - Modal displaying game rules and instructions
 */
export const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800/25 backdrop-blur-md rounded-lg border-2 border-white/75 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-white/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">How to Play</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-600 transition-colors"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Goal Section */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">🎯 The Goal</h3>
            <p className="text-gray-300">
              Guess the daily MCU character in as few attempts as possible.
              You'll have clues to help you along the way!
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              🎮 How It Works
            </h3>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              <li>Start by typing the name of any MCU character</li>
              <li>
                A grid will show how your guess compares to the target character
              </li>
              <li>
                After your first attempt, clue buttons will become available
              </li>
              <li>Use clues to narrow down the possibilities</li>
              <li>Keep guessing until you find the correct character!</li>
            </ol>
          </div>

          {/* Grid Indicators */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              📊 Grid Indicators
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded border border-white/20"></div>
                <span className="text-gray-300">
                  <strong>Green:</strong> Correct match
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-600 rounded border border-white/20"></div>
                <span className="text-gray-300">
                  <strong>Yellow:</strong> Partial match
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded border border-white/20"></div>
                <span className="text-gray-300">
                  <strong>Red:</strong> No match
                </span>
              </div>
            </div>
          </div>

          {/* Clues */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">💡 Clues</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong>Quote Clue:</strong> Available after 5 attempts. Shows a
                memorable quote from the character.
              </p>
              <p>
                <strong>Image Clue:</strong> Available after 12 attempts. Shows
                a zoomed and blurred section of the character's image.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">⭐ Tips</h3>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Pay attention to gender, species, and affiliations</li>
              <li>Use clues wisely to narrow down your options</li>
              <li>New challenge every day at midnight UTC</li>
              <li>Build your streak by playing every day!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 p-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-b from-red-600 to-red-700 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Got it! Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
