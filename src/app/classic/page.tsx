import ClassicChallenge from "@/components/classic-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";
import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/lib/dailyChallengeCache";

const ClassicModePage = async () => {
  const [challenge, lastChallenge] = await Promise.all([
    getDailyChallenge(),
    getLastDailyChallenge()
  ]);

  return (
    <>
      <FloatingNavbar gameMode={GameMode.CLASSIC} />
      <ClassicChallenge
        character={challenge.character}
        lastCharacter={lastChallenge?.character || null}
      />
    </>
  );
};

export default ClassicModePage;
