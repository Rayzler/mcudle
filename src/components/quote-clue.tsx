import { shareTech } from "@/fonts";
import { GAME_LABELS } from "@/constants/gameConfig";

interface QuoteClueProps {
  isVisible: boolean;
  quote: string | undefined;
  hasQuotes: boolean;
}

/**
 * Displays the quote clue for the current character
 * Shows a quote if available, otherwise displays a fallback message
 */
export const QuoteClue = ({ isVisible, quote, hasQuotes }: QuoteClueProps) => {
  if (!isVisible) return null;

  return (
    <p
      className={`${shareTech.className} text-xl text-center mt-4 uppercase animate-flip-up animate-duration-200`}
    >
      {hasQuotes && quote ? `"${quote}"` : GAME_LABELS.NO_QUOTES_MESSAGE}
    </p>
  );
};

export default QuoteClue;
