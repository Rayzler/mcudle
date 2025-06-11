import Prisma from "@prisma/client";

export interface Character extends Prisma.Character {
  teams?: Prisma.Team[];
  quote?: Prisma.Quote[];
}

export interface DailyChallenge extends Prisma.DailyChallenge {
  character: Character;
  posterCharacter: Character;
  emojiCharacter: Character;
  posterMovie: Prisma.Movie;
  quote: Prisma.Quote;
  item: Prisma.Item;
}