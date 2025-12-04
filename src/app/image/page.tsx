import ImageChallenge from "@/components/modes/image-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";
import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/lib/dailyChallengeCache";

const ImageModePage = async () => {
  const [challenge, lastChallenge] = await Promise.all([
    getDailyChallenge(),
    getLastDailyChallenge()
  ]);

  return (
    <>
      <FloatingNavbar gameMode={GameMode.IMAGE} />
      <ImageChallenge
        character={challenge.posterCharacter}
        lastCharacter={lastChallenge?.posterCharacter || null}
      />
    </>
  );
};

export default ImageModePage;
