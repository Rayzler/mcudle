"use client";

import { Character } from "@/types/prisma";
import CharactersInput from "../characters-input";
import { useRef } from "react";
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
 * Sanitizes emoji content to prevent XSS attacks
 * Uses a strict whitelist approach that only allows actual emoji characters
 * Based on Unicode emoji ranges and common emoji patterns
 */
const sanitizeEmojis = (content: string | null | undefined): string => {
  if (!content || typeof content !== "string") {
    return "😊";
  }

  // Regex pattern that matches emoji characters from various Unicode ranges
  // Includes: Basic Emoji, Emoticons, Symbols, Pictographs, and variations
  const emojiPattern =
    /[\p{Emoji}\p{Emoji_Component}](?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|\u{20E3})?(?:\u{200D}[\p{Emoji}\p{Emoji_Component}](?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|\u{20E3})?)*|\u{2764}\u{FE0F}?/gu;

  // Extract only valid emoji characters and whitespace
  const emojis = content.match(emojiPattern) || [];
  const sanitized = emojis.join("").trim();

  return sanitized || "😊";
};

/**
 * EmojiChallenge - Emoji game mode component
 * Player guesses the character from emojis
 * Displays only the emojis and character name/photo after win
 */
export const EmojiChallenge = ({ character, lastCharacter }: Props) => {
  const { attempts, hasWon, addAttempt, win } = useGameState(
    GameMode.EMOJI,
    character.id
  );

  const winCardRef = useRef<HTMLDivElement>(null);

  /**
   * Checks if selected character matches the target character
   * If correct, triggers win animation
   */
  const checkCharacter = (selectedCharacter: Character) => {
    if (selectedCharacter.id === character.id) {
      handleWin();
    }
    addAttempt(selectedCharacter);
  };

  /**
   * Triggers win state and confetti animation
   */
  const handleWin = () => {
    win();
    updateStreakOnWin(GameMode.EMOJI);
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
          Who do these emojis represent?
        </h1>

        {/* Emojis display */}
        <p className="text-6xl text-center mt-6 mb-6">
          {sanitizeEmojis(character.emojis)}
        </p>

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
              gameMode={GameMode.EMOJI}
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

export default EmojiChallenge;
