import type {
  Character as PrismaCharacter,
  Quote as PrismaQuote,
  DailyChallenge as PrismaDailyChallenge,
  Team,
  Movie,
  Item
} from "@prisma/client";

export interface Character extends PrismaCharacter {
  teams?: Team[];
  quote?: PrismaQuote[];
}

export interface Quote extends PrismaQuote {
  character: Character;
}

export interface DailyChallenge extends PrismaDailyChallenge {
  character: Character;
  posterCharacter: Character;
  emojiCharacter: Character;
  posterMovie: Movie;
  quote: Quote;
  item: Item;
}
