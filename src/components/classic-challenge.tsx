"use client";

import { Character } from "@/types/prisma";
import CharactersInput from "./characters-input";
import { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import CharactersGrid from "./characters-grid";
import ClueButtons from "./ClueButtons";
import QuoteClue from "./QuoteClue";
import ImageClue from "./ImageClue";
import { getDailyRandomElement } from "@/lib/dateUtils";
import { useImageZoomPosition } from "@/hooks/useImageZoomPosition";
import { GAME_CONFIG, GAME_LABELS } from "@/constants/gameConfig";

type Props = {
  character: Character;
  lastCharacter: Character | null;
};

/**
 * ClassicChallenge - Main game component for the MCU Wordle-like game
 * Handles game state, character checking, and clue display
 */
export const ClassicChallenge = ({ character, lastCharacter }: Props) => {
  // Game state
  const [attempts, setAttempts] = useState<Character[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Get random position for image zoom using custom hook
  const randomPosition = useImageZoomPosition(character.id);

  // Memoize quote selection to ensure it doesn't change on every render
  const quoteClue = useMemo(
    () => getDailyRandomElement(character.quote?.map((q) => q.text) || []),
    [character.quote]
  );

  // Check if character has quotes available
  const hasQuotes = (character.quote?.length ?? 0) > 0;

  /**
   * Checks if selected character matches the target character
   * If correct, triggers win animation
   * Adds attempt to history regardless
   */
  const checkCharacter = (selectedCharacter: Character) => {
    if (selectedCharacter.id === character?.id) {
      setTimeout(win, GAME_CONFIG.WIN_ANIMATION_DELAY);
    } else {
      console.log(GAME_LABELS.INCORRECT_MESSAGE);
    }
    setAttempts((prevAttempts) => [selectedCharacter, ...prevAttempts]);
  };

  /**
   * Triggers win state and confetti animation
   */
  const win = () => {
    setHasWon(true);
    confetti({ colors: GAME_CONFIG.CONFETTI_COLORS });
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full px-24">
      <div className="bg-neutral-800/25 backdrop-blur-md p-8 pb-7 rounded-lg shadow-lg w-full max-w-xl border-2 border-white/75">
        <h1 className="text-3xl text-center text-white font-bold">
          {GAME_LABELS.TITLE}
        </h1>

        {/* Victory message */}
        {hasWon && (
          <p className="text-lg text-center text-green-400 mt-2 font-bold animate-bounce">
            {GAME_LABELS.WIN_MESSAGE}
          </p>
        )}

        {/* Clue buttons - shown after first attempt */}
        {attempts.length > 0 ? (
          <ClueButtons
            attemptsCount={attempts.length}
            showQuote={showQuote}
            showImage={showImage}
            onQuoteToggle={() => setShowQuote(!showQuote)}
            onImageToggle={() => setShowImage(!showImage)}
          />
        ) : (
          <p className="text-lg text-center text-gray-300 mt-2">
            {GAME_LABELS.START_MESSAGE}
          </p>
        )}

        {/* Quote clue */}
        <QuoteClue
          isVisible={showQuote}
          quote={quoteClue}
          hasQuotes={hasQuotes}
        />

        {/* Image clue */}
        <ImageClue
          isVisible={showImage}
          imageUrl={character.imageUrl || null}
          characterName={character.name}
          position={randomPosition}
        />
      </div>

      {/* Character search input - hidden after win */}
      {!hasWon && (
        <CharactersInput
          onCharacterSelected={checkCharacter}
          selectedIds={attempts.map((a) => a.id)}
        />
      )}

      {/* Results grid showing all attempts */}
      <CharactersGrid attempts={attempts} character={character} />

      {/* Yesterday's character */}
      {lastCharacter && (
        <div className="w-full max-w-xl mt-8 bg-neutral-800/25 backdrop-blur-md p-4 rounded-lg border-2 border-white/50">
          <p className="text-lg text-center text-white font-semibold">
            Yesterday's character was:{" "}
            <span className="text-red-600">{lastCharacter.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassicChallenge;
