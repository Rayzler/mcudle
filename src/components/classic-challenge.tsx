"use client";

import { Character } from "@/types/prisma";
import CharactersInput from "./characters-input";
import { useState } from "react";
import confetti from "canvas-confetti";
import CharactersGrid from "./characters-grid";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import ClueButton from "./clue-button";
import { shareTech } from "@/fonts";
import { getDailyRandomElement } from "@/lib/dateUtils";

type Props = {
  character: Character;
};

const triesUntilQuote = 5; // Number of attempts before showing the quote
const triesUntilImage = 12; // Number of attempts before showing the image

const ClassicChallenge = ({ character }: Props) => {
  const [attempts, setAttempts] = useState<Character[]>([]);
  const [showQuote, setShowQuote] = useState(false);

  const checkCharacter = (selectedCharacter: Character) => {
    if (selectedCharacter.id === character?.id) {
      setTimeout(win, 1800);
    } else {
      console.log("Incorrect! Try again.");
    }
    setAttempts((prevAttempts) => [selectedCharacter, ...prevAttempts]);
  };

  const getQuoteClue = () => {
    return getDailyRandomElement(character.quote?.map((q) => q.text) || []);
  };

  const win = () => {
    confetti({ colors: ["#ff0d0d", "#ffffff", "#b81414"] });
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full px-24">
      <div className="bg-neutral-800/25 backdrop-blur-md p-8 pb-7 rounded-lg shadow-lg w-full max-w-xl border-2 border-white/75">
        <h1 className="text-3xl text-center text-white font-bold">
          Guess today's MCU character!
        </h1>
        {attempts.length > 0 ? (
          <div className="flex justify-evenly">
            <ClueButton
              disabled={attempts.length < triesUntilQuote}
              triesUntilClue={triesUntilQuote - attempts.length}
              type="Quote"
              onClick={() => setShowQuote(!showQuote)}
            >
              <BiSolidQuoteLeft size={28} />
            </ClueButton>
            <ClueButton
              disabled={attempts.length < triesUntilImage}
              triesUntilClue={triesUntilImage - attempts.length}
              type="Image"
            >
              <IoIosImages size={28} />
            </ClueButton>
          </div>
        ) : (
          <p className="text-lg text-center text-gray-300 mt-2">
            Type any character to start.
          </p>
        )}
        {showQuote && (
          <p
            className={`${shareTech.className} text-xl text-center mt-4 uppercase animate-flip-up animate-duration-200`}
          >
            "{getQuoteClue()}"
          </p>
        )}
      </div>
      <CharactersInput
        onCharacterSelected={checkCharacter}
        selectedIds={attempts.map((a) => a.id)}
      />
      <CharactersGrid attempts={attempts} character={character} />
    </div>
  );
};

export default ClassicChallenge;
