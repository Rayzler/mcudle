import { BiSolidQuoteLeft } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import ClueButton from "./clue-button";
import { CLUE_CONFIG } from "@/constants/gameConfig";

interface ClueButtonsProps {
  attemptsCount: number;
  showQuote: boolean;
  showImage: boolean;
  onQuoteToggle: () => void;
  onImageToggle: () => void;
}

/**
 * Renders the quote and image clue buttons
 * Buttons are disabled until the required number of attempts is reached
 */
export const ClueButtons = ({
  attemptsCount,
  showQuote,
  showImage,
  onQuoteToggle,
  onImageToggle
}: ClueButtonsProps) => {
  const quoteDisabled = attemptsCount < CLUE_CONFIG.QUOTE.triesUntil;
  const imageDisabled = attemptsCount < CLUE_CONFIG.IMAGE.triesUntil;

  return (
    <div className="flex justify-evenly">
      <ClueButton
        disabled={quoteDisabled}
        triesUntilClue={
          quoteDisabled
            ? CLUE_CONFIG.QUOTE.triesUntil - attemptsCount
            : undefined
        }
        type={CLUE_CONFIG.QUOTE.type}
        onClick={onQuoteToggle}
      >
        <BiSolidQuoteLeft size={28} />
      </ClueButton>
      <ClueButton
        disabled={imageDisabled}
        triesUntilClue={
          imageDisabled
            ? CLUE_CONFIG.IMAGE.triesUntil - attemptsCount
            : undefined
        }
        type={CLUE_CONFIG.IMAGE.type}
        onClick={onImageToggle}
      >
        <IoIosImages size={28} />
      </ClueButton>
    </div>
  );
};

export default ClueButtons;
