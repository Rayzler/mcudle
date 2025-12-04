"use client";

import { IoClose } from "react-icons/io5";
import { GameMode } from "@/constants/enums";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode?: GameMode;
}

/**
 * HowToPlayModal - Modal displaying game rules and instructions
 * Content varies based on game mode
 */
export const HowToPlayModal = ({
  isOpen,
  onClose,
  gameMode = GameMode.CLASSIC
}: HowToPlayModalProps) => {
  if (!isOpen) return null;

  const isClassicMode = gameMode === GameMode.CLASSIC;
  const isQuoteMode = gameMode === GameMode.QUOTE;
  const isImageMode = gameMode === GameMode.IMAGE;

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
              {isClassicMode
                ? "Guess the daily MCU character in as few attempts as possible. You'll have clues to help you along the way!"
                : isQuoteMode
                ? "Guess which MCU character said the famous quote. Can you figure it out?"
                : isImageMode
                ? "Guess the character from a zoomed image. With each wrong attempt, the zoom level decreases, revealing more of the image!"
                : "Guess the daily MCU character in as few attempts as possible!"}
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              🎮 How It Works
            </h3>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              {isClassicMode ? (
                <>
                  <li>Start by typing the name of any MCU character</li>
                  <li>
                    A grid will show how your guess compares to the target
                    character
                  </li>
                  <li>
                    After your first attempt, clue buttons will become available
                  </li>
                  <li>Use clues to narrow down the possibilities</li>
                  <li>Keep guessing until you find the correct character!</li>
                </>
              ) : isQuoteMode ? (
                <>
                  <li>You'll see a famous quote from an MCU character</li>
                  <li>Type the name of the character who said it</li>
                  <li>
                    Your guesses will appear as a simple list showing who you've
                    tried
                  </li>
                  <li>Keep guessing until you find the right character!</li>
                </>
              ) : isImageMode ? (
                <>
                  <li>
                    You'll see a heavily zoomed image of a character
                  </li>
                  <li>
                    Start guessing! The image is very zoomed in to make it
                    challenging
                  </li>
                  <li>
                    With each wrong guess, the zoom level decreases
                  </li>
                  <li>
                    The image gradually reveals more detail until you reach
                    normal zoom (1x)
                  </li>
                  <li>
                    Keep guessing until you identify the character correctly!
                  </li>
                </>
              ) : (
                <>
                  <li>Start by typing the name of any MCU character</li>
                  <li>Keep guessing until you find the correct character!</li>
                </>
              )}
            </ol>
          </div>

          {/* Grid Indicators - Only for Classic Mode */}
          {isClassicMode && (
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
          )}

          {/* Quote Mode Indicators */}
          {isQuoteMode && (
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-2">
                ✅ Result Indicators
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600/20 rounded border-2 border-green-500"></div>
                  <span className="text-gray-300">
                    <strong>Green:</strong> Correct character - you won!
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600/20 rounded border-2 border-red-500"></div>
                  <span className="text-gray-300">
                    <strong>Red:</strong> Incorrect guess
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Clues - Only for Classic Mode */}
          {isClassicMode && (
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-2">💡 Clues</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Quote Clue:</strong> Available after 5 attempts. Shows
                  a memorable quote from the character.
                </p>
                <p>
                  <strong>Image Clue:</strong> Available after 12 attempts.
                  Shows a zoomed and blurred section of the character's image.
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-2">⭐ Tips</h3>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              {isClassicMode ? (
                <>
                  <li>Pay attention to gender, species, and affiliations</li>
                  <li>Use clues wisely to narrow down your options</li>
                  <li>New challenge every day at midnight UTC</li>
                  <li>Build your streak by playing every day!</li>
                </>
              ) : isQuoteMode ? (
                <>
                  <li>
                    Think about which character has a memorable personality
                  </li>
                  <li>Consider the context of the quote</li>
                  <li>New quote every day at midnight UTC</li>
                  <li>Build your streak by playing every day!</li>
                </>
              ) : isImageMode ? (
                <>
                  <li>Pay attention to clothing and distinctive features</li>
                  <li>Skin tone and hair color can be very helpful</li>
                  <li>The zoom decreases smoothly with each attempt</li>
                  <li>New image every day at midnight UTC</li>
                  <li>Build your streak by playing every day!</li>
                </>
              ) : (
                <>
                  <li>New challenge every day at midnight UTC</li>
                  <li>Build your streak by playing every day!</li>
                </>
              )}
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
