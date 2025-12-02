import { getUTCDate } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import { DailyChallenge } from "@/types/prisma";

export const getDailyChallenge = async (): Promise<DailyChallenge> => {
  try {
    const today = getUTCDate();

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        date: today
      },
      include: {
        character: {
          include: {
            teams: true,
            quote: true
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
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    throw new Error("Failed to load daily challenge");
  }
};

/**
 * Creates a new daily challenge with randomly selected IDs efficiently
 * Uses direct SQL to select random records without loading all data into memory
 */
export const createDailyChallenge = async (): Promise<DailyChallenge> => {
  try {
    const today = getUTCDate();

    // Get a random ID from each table without loading all records
    const [randomCharacterResult] = await prisma.$queryRaw<
      Array<{ id: string }>
    >`SELECT id FROM characters ORDER BY RANDOM() LIMIT 1`;

    const [randomPosterCharacterResult] = await prisma.$queryRaw<
      Array<{ id: string }>
    >`SELECT id FROM characters ORDER BY RANDOM() LIMIT 1`;

    const [randomEmojiCharacterResult] = await prisma.$queryRaw<
      Array<{ id: string }>
    >`SELECT id FROM characters ORDER BY RANDOM() LIMIT 1`;

    const [randomMovieResult] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM movies ORDER BY RANDOM() LIMIT 1
    `;

    const [randomQuoteResult] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM quotes ORDER BY RANDOM() LIMIT 1
    `;

    const [randomItemResult] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM items ORDER BY RANDOM() LIMIT 1
    `;

    // Validate that results were obtained
    if (
      !randomCharacterResult ||
      !randomPosterCharacterResult ||
      !randomEmojiCharacterResult ||
      !randomMovieResult ||
      !randomQuoteResult ||
      !randomItemResult
    ) {
      throw new Error("Insufficient data to create daily challenge");
    }

    const dailyChallenge = await prisma.dailyChallenge.create({
      data: {
        date: today,
        classicCharacterId: randomCharacterResult.id,
        posterCharacterId: randomPosterCharacterResult.id,
        emojiCharacterId: randomEmojiCharacterResult.id,
        posterMovieId: randomMovieResult.id,
        quoteId: randomQuoteResult.id,
        itemId: randomItemResult.id
      },
      include: {
        character: {
          include: {
            teams: true,
            quote: true
          }
        },
        posterCharacter: true,
        posterMovie: true,
        emojiCharacter: true,
        quote: true,
        item: true
      }
    });

    return dailyChallenge;
  } catch (error) {
    console.error("Error creating daily challenge:", error);
    throw new Error("Failed to create daily challenge");
  }
};
