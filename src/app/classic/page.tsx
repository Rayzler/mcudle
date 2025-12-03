import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import ClassicChallenge from "@/components/classic-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";

const ClassicModePage = async () => {
  const { character } = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <FloatingNavbar gameMode={GameMode.CLASSIC} />
      <ClassicChallenge
        character={character}
        lastCharacter={lastChallenge?.character || null}
      />
    </>
  );
};

export default ClassicModePage;
