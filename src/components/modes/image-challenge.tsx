"use client";

import { Character } from "@/types/prisma";
import CharactersInput from "../characters-input";
import { useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import WinCard from "../win-card";
import { useGameState } from "@/hooks/useGameState";
import { GAME_CONFIG, GAME_LABELS } from "@/constants/gameConfig";
import { updateStreakOnWin } from "@/lib/streakService";
import { GameMode } from "@/constants/enums";

type Props = {
  character: Character;
  lastCharacter: Character | null;
};

/**
 * ImageChallenge - Image game mode component
 * Player guesses the character from a zoomed image
 * Zoom decreases with each wrong attempt, starting at 8x zoom
 */
export const ImageChallenge = ({ character, lastCharacter }: Props) => {
  const { attempts, hasWon, addAttempt, win } = useGameState(
    GameMode.IMAGE,
    character.id
  );

  const winCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate zoom level based on attempts with dynamic decrease
  // From 5x to 3x: decrease by 0.5 per attempt
  // From 3x to 1x: decrease by 0.25 per attempt
  const calculateZoom = () => {
    let currentZoom = GAME_CONFIG.IMAGE_MODE_BASE_ZOOM;
    const fastPhaseAttempts = Math.ceil(
      (GAME_CONFIG.IMAGE_MODE_BASE_ZOOM -
        GAME_CONFIG.IMAGE_MODE_ZOOM_THRESHOLD) /
        GAME_CONFIG.IMAGE_MODE_ZOOM_DECREASE_FAST
    );

    if (attempts.length <= fastPhaseAttempts) {
      // Fast decrease phase (0.5 per attempt)
      currentZoom =
        GAME_CONFIG.IMAGE_MODE_BASE_ZOOM -
        attempts.length * GAME_CONFIG.IMAGE_MODE_ZOOM_DECREASE_FAST;
    } else {
      // Slow decrease phase (0.25 per attempt)
      currentZoom =
        GAME_CONFIG.IMAGE_MODE_ZOOM_THRESHOLD -
        (attempts.length - fastPhaseAttempts) *
          GAME_CONFIG.IMAGE_MODE_ZOOM_DECREASE_SLOW;
    }

    return Math.max(GAME_CONFIG.IMAGE_MODE_MIN_ZOOM, currentZoom);
  };

  const currentZoom = calculateZoom();

  // Draw zoomed image on canvas to prevent right-click image extraction
  useEffect(() => {
    if (!canvasRef.current || !character.imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Always use the center of the image as pivot point
      const centerX = img.width / 2;
      const centerY = img.height / 2;

      // Calculate zoom dimensions maintaining aspect ratio
      const boxWidth = img.width / currentZoom;
      const boxHeight = img.height / currentZoom;

      // Calculate source coordinates centered on pivot point
      const sourceX = centerX - boxWidth / 2;
      const sourceY = centerY - boxHeight / 2;

      // Draw zoomed section
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        boxWidth,
        boxHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.restore();
    };
    img.src = character.imageUrl;
  }, [character.imageUrl, currentZoom]);

  /**
   * Checks if selected character matches the target character
   * If correct, triggers win animation
   */
  const checkCharacter = (selectedCharacter: Character) => {
    if (selectedCharacter.id === character.id) {
      handleWin();
    } else {
      console.log(GAME_LABELS.INCORRECT_MESSAGE);
    }
    addAttempt(selectedCharacter);
  };

  /**
   * Triggers win state and confetti animation
   */
  const handleWin = () => {
    win();
    updateStreakOnWin(GameMode.IMAGE);
    setTimeout(() => {
      confetti({ colors: GAME_CONFIG.CONFETTI_COLORS });
      winCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full grow px-24">
      <div className="bg-neutral-800/25 backdrop-blur-md p-8 pb-7 rounded-lg shadow-lg w-full max-w-xl border-2 border-white/75">
        <h1 className="text-lg text-center text-white font-bold">
          Who is in this image?
        </h1>

        {/* Image clue - zoomed section using canvas */}
        {character.imageUrl && (
          <div className="mt-6 mb-6 flex justify-center">
            <canvas
              ref={canvasRef}
              width={128}
              height={192}
              className="rounded-lg border-2 border-white/50 shadow-lg"
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            />
          </div>
        )}

        {/* Zoom level indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-300">
            Zoom:{" "}
            <span className="text-white font-bold">
              {currentZoom.toFixed(1)}x
            </span>
          </p>
          {attempts.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Attempts: {attempts.length}
            </p>
          )}
        </div>

        {/* Start message */}
        {attempts.length === 0 && (
          <p className="text-lg text-center text-gray-300 mt-4">
            {GAME_LABELS.START_MESSAGE}
          </p>
        )}
      </div>

      {/* Character search input - disabled after win */}
      <CharactersInput
        onCharacterSelected={checkCharacter}
        selectedIds={attempts.map((a) => a.id)}
        disabled={hasWon}
      />

      <div className="grow w-full max-w-[620px]">
        {/* Attempts list - vertical list with photo, name, and result color */}
        {attempts.length > 0 && (
          <div className="w-full max-w-[50%] items-center mx-auto mt-8 mb-4">
            <div className="flex flex-col gap-3">
              {attempts.map((attempt) => {
                const isCorrect = attempt.id === character.id;
                const bgColor = isCorrect
                  ? "bg-green-600/20 border-green-500"
                  : "bg-red-600/20 border-red-500";

                return (
                  <div
                    key={attempt.id}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 ${bgColor}`}
                  >
                    {/* Character photo */}
                    {attempt.imageUrl && (
                      <img
                        src={attempt.imageUrl}
                        alt={attempt.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 object-top"
                      />
                    )}

                    {/* Character name */}
                    <p className="text-lg text-white font-semibold">
                      {attempt.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Win card - shown when player wins */}
        {hasWon && (
          <div ref={winCardRef}>
            <WinCard
              character={character}
              attempts={attempts.length}
              gameMode={GameMode.IMAGE}
            />
          </div>
        )}
      </div>

      {/* Yesterday's character */}
      {lastCharacter && (
        <div className="w-full max-w-xl mt-6 bg-neutral-800/25 backdrop-blur-md p-4 rounded-lg border-2 border-white/50">
          <p className="text-lg text-center text-white font-semibold">
            Yesterday's character was:{" "}
            <span className="text-red-600">{lastCharacter.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageChallenge;
