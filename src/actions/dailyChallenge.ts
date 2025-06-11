import { getUTCDate } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import { DailyChallenge } from "@/types/prisma";

export const getDailyChallenge = async (): Promise<DailyChallenge> => {
  const today = getUTCDate();

  const challenge = await prisma.dailyChallenge.findUnique({
    where: {
      date: today
    },
    include: {
      character: {
        include: {
          teams: true,
          quote: true,
        }
      },
      posterCharacter: true,
      posterMovie: true,
      emojiCharacter: true,
      quote: true,
      item: true
    }
  });

  if (!challenge) {
    return await createDailyChallenge();
  }

  return challenge;
};

export const createDailyChallenge = async (): Promise<DailyChallenge> => {
  const today = getUTCDate();

  const characters = await prisma.character.findMany();
  const movies = await prisma.movie.findMany();
  const quotes = await prisma.quote.findMany();
  const items = await prisma.item.findMany();

  const randomCharacter =
    characters[Math.floor(Math.random() * characters.length)];
  const randomPosterCharacter =
    characters[Math.floor(Math.random() * characters.length)];
  const randomEmojiCharacter =
    characters[Math.floor(Math.random() * characters.length)];
  const randomMovie = movies[Math.floor(Math.random() * movies.length)];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomItem = items[Math.floor(Math.random() * items.length)];

  const dailyChallenge = await prisma.dailyChallenge.create({
    data: {
      date: today,
      classicCharacterId: randomCharacter.id,
      posterCharacterId: randomPosterCharacter.id,
      emojiCharacterId: randomEmojiCharacter.id,
      posterMovieId: randomMovie.id,
      quoteId: randomQuote.id,
      itemId: randomItem.id
    },
    include: {
      character: true,
      posterCharacter: true,
      posterMovie: true,
      emojiCharacter: true,
      quote: true,
      item: true
    }
  });

  return dailyChallenge;
};
