import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/actions/dailyChallenge";
import EmojiChallenge from "@/components/emoji-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";

const EmojiModePage = async () => {
  const dailyChallenge = await getDailyChallenge();
  const lastChallenge = await getLastDailyChallenge();

  return (
    <>
      <FloatingNavbar gameMode={GameMode.EMOJI} />
      <EmojiChallenge
        character={dailyChallenge.emojiCharacter}
        lastCharacter={lastChallenge?.emojiCharacter || null}
      />
    </>
  );
};

export default EmojiModePage;
