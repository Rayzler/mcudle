import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import ClassicChallenge from "@/components/classic-challenge";
import FloatingNavbar from "@/components/floating-navbar";

const ClassicModePage = async () => {
  const { character } = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <FloatingNavbar />
      <ClassicChallenge
        character={character}
        lastCharacter={lastChallenge?.character || null}
      />
    </>
  );
};

export default ClassicModePage;
