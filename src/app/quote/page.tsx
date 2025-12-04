import QuoteChallenge from "@/components/modes/quote-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";
import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/lib/dailyChallengeCache";

const QuoteModePage = async () => {
  const [challenge, lastChallenge] = await Promise.all([
    getDailyChallenge(),
    getLastDailyChallenge()
  ]);

  return (
    <>
      <FloatingNavbar gameMode={GameMode.QUOTE} />
      <QuoteChallenge
        quote={challenge.quote}
        lastCharacter={lastChallenge?.quote?.character || null}
      />
    </>
  );
};

export default QuoteModePage;
