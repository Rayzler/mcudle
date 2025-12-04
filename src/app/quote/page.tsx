import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import QuoteChallenge from "@/components/quote-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";

const QuoteModePage = async () => {
  const dailyChallenge = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <FloatingNavbar gameMode={GameMode.QUOTE} />
      <QuoteChallenge
        quote={dailyChallenge.quote}
        lastCharacter={lastChallenge?.quote?.character || null}
      />
    </>
  );
};

export default QuoteModePage;
