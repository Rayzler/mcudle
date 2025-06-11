import { getDailyChallenge } from "@/actions/dailyChallenge";
import ClassicChallenge from "@/components/classic-challenge";

const ClassicModePage = async () => {
  const { character } = await getDailyChallenge();

  return (
    <>
      <ClassicChallenge character={character} />
    </>
  );
};

export default ClassicModePage;
