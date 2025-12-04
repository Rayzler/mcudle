import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import ImageChallenge from "@/components/image-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";

const ImageModePage = async () => {
  const dailyChallenge = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <FloatingNavbar gameMode={GameMode.IMAGE} />
      <ImageChallenge
        character={dailyChallenge.character}
        lastCharacter={lastChallenge?.character || null}
      />
    </>
  );
};

export default ImageModePage;
