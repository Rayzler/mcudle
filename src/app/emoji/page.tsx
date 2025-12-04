"use client";

import EmojiChallenge from "@/components/emoji-challenge";
import FloatingNavbar from "@/components/floating-navbar";
import { GameMode } from "@/constants/enums";
import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/lib/dailyChallengeCache";

const EmojiModePage = async () => {
  const [challenge, lastChallenge] = await Promise.all([
    getDailyChallenge(),
    getLastDailyChallenge()
  ]);

  return (
    <>
      <FloatingNavbar gameMode={GameMode.EMOJI} />
      <EmojiChallenge
        character={challenge.emojiCharacter}
        lastCharacter={lastChallenge?.emojiCharacter || null}
      />
    </>
  );
};

export default EmojiModePage;
