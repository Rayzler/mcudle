import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import ClassicChallenge from "@/components/classic-challenge";

const ClassicModePage = async () => {
  const { character } = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <ClassicChallenge
        character={character}
        lastCharacter={lastChallenge?.character || null}
      />
    </>
  );
};

export default ClassicModePage;
