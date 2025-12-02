"use client";

import { Character } from "@/types/prisma";
import { useEffect, useState } from "react";

interface WinCardProps {
  character: Character;
  attempts: number;
  onMounted?: () => void;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * WinCard - Displays victory stats and character reveal
 * Shows attempts count, character details, and encouragement message
 */
export const WinCard = ({ character, attempts, onMounted }: WinCardProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Scroll into view when component mounts
    onMounted?.();
  }, [onMounted]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time and tomorrow's midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const getEncouragementMessage = (attempts: number) => {
    if (attempts === 1) return "🎯 Perfect! First try!";
    if (attempts <= 3) return "🌟 Excellent work!";
    if (attempts <= 5) return "✨ Great job!";
    if (attempts <= 10) return "👍 Nice guessing!";
    return "💪 You got there!";
  };

  return (
    <div className="w-full max-w-xl mt-12 mb-8">
      <div className="bg-gradient-to-b from-green-900/30 to-green-800/20 backdrop-blur-md p-8 rounded-xl border-2 border-green-500/50 shadow-xl">
        {/* Victory Title */}
        <div className="text-center mb-6">
          <p className="text-5xl mb-2">🎉</p>
          <h2 className="text-3xl font-bold text-green-400 mb-2">You Won!</h2>
          <p className="text-lg text-green-300">
            {getEncouragementMessage(attempts)}
          </p>
        </div>

        {/* Character Card */}
        <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex gap-4 items-center">
            <img
              src={
                character.imageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt={character.name}
              className="w-20 h-20 rounded-lg object-cover object-top"
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                The character was
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                {character.name}
              </h3>
              <div className="flex gap-2 text-xs">
                <span className="bg-white/10 px-2 py-1 rounded">
                  {character.species}
                </span>
                <span className="bg-white/10 px-2 py-1 rounded capitalize">
                  {character.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Attempts */}
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/20 text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-1">{attempts}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {attempts === 1 ? "Attempt" : "Attempts"}
            </p>
          </div>

          {/* Accuracy */}
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/20 text-center">
            <p className="text-3xl font-bold text-purple-400 mb-1">
              {attempts === 1 ? "100%" : `${Math.round((1 / attempts) * 100)}%`}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Accuracy
            </p>
          </div>
        </div>

        {/* Description */}
        {character.description && (
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/20 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              About
            </p>
            <p className="text-sm text-gray-300 line-clamp-3">
              {character.description}
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/20 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
            Next Challenge In
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {String(timeLeft.hours).padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500">Hours</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {String(timeLeft.minutes).padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500">Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500">Seconds</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Come back tomorrow for a new challenge! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinCard;
