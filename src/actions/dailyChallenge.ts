import { getUTCDate } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import { DailyChallenge } from "@/types/prisma";
import { Prisma } from "@prisma/client";

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
        quote: {
          include: {
            character: true
          }
        },
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

export const getLastDailyChallenge =
  async (): Promise<DailyChallenge | null> => {
    try {
      const today = getUTCDate();

      // Create a date for yesterday
      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);

      const challenge = await prisma.dailyChallenge.findUnique({
        where: {
          date: yesterday
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
          quote: {
            include: {
              character: true
            }
          },
          item: true
        }
      });

      return challenge;
    } catch (error) {
      console.error("Error fetching last daily challenge:", error);
      throw new Error("Failed to load last daily challenge");
    }
  };

/**
 * Creates a new daily challenge with randomly selected IDs efficiently
 * Uses direct SQL to select random records without loading all data into memory
 * Ensures no character repeats within the last 14 days for each game mode
 */
export const createDailyChallenge = async (): Promise<DailyChallenge> => {
  try {
    const today = getUTCDate();

    // Get the last 14 days of challenges to avoid repeating characters
    const cooldownDays = 14;
    const cooldownStart = new Date(today);
    cooldownStart.setUTCDate(cooldownStart.getUTCDate() - cooldownDays);

    const recentChallenges = await prisma.dailyChallenge.findMany({
      where: {
        date: {
          gte: cooldownStart,
          lt: today
        }
      },
      select: {
        classicCharacterId: true,
        posterCharacterId: true,
        emojiCharacterId: true
      }
    });

    // Extract recent character IDs for each mode
    const recentClassicIds = recentChallenges
      .map((c) => c.classicCharacterId)
      .filter((id): id is string => id !== null);

    const recentPosterIds = recentChallenges
      .map((c) => c.posterCharacterId)
      .filter((id): id is string => id !== null);

    const recentEmojiIds = recentChallenges
      .map((c) => c.emojiCharacterId)
      .filter((id): id is string => id !== null);

    // Get a random ID from each table without loading all records
    // Exclude characters from the last 14 days
    let randomCharacterResult: Array<{ id: string }> = [];
    let attempts = 0;
    while (randomCharacterResult.length === 0 && attempts < 5) {
      const result = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM characters 
        WHERE id NOT IN (${Prisma.join(recentClassicIds)})
        ORDER BY RANDOM() LIMIT 1
      `;
      randomCharacterResult = result;
      attempts++;
    }

    let randomPosterCharacterResult: Array<{ id: string }> = [];
    attempts = 0;
    while (randomPosterCharacterResult.length === 0 && attempts < 5) {
      const result = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM characters 
        WHERE id NOT IN (${Prisma.join(recentPosterIds)})
        ORDER BY RANDOM() LIMIT 1
      `;
      randomPosterCharacterResult = result;
      attempts++;
    }

    let randomEmojiCharacterResult: Array<{ id: string }> = [];
    attempts = 0;
    while (randomEmojiCharacterResult.length === 0 && attempts < 5) {
      const result = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM characters 
        WHERE (emojis IS NOT NULL AND emojis != '')
        AND id NOT IN (${Prisma.join(recentEmojiIds)})
        ORDER BY RANDOM() LIMIT 1
      `;
      randomEmojiCharacterResult = result;
      attempts++;
    }

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
      randomCharacterResult.length === 0 ||
      randomPosterCharacterResult.length === 0 ||
      randomEmojiCharacterResult.length === 0 ||
      !randomMovieResult ||
      !randomQuoteResult ||
      !randomItemResult
    ) {
      throw new Error("Insufficient data to create daily challenge");
    }

    const dailyChallenge = await prisma.dailyChallenge.create({
      data: {
        date: today,
        classicCharacterId: randomCharacterResult[0].id,
        posterCharacterId: randomPosterCharacterResult[0].id,
        emojiCharacterId: randomEmojiCharacterResult[0].id,
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
        quote: {
          include: {
            character: true
          }
        },
        item: true
      }
    });

    return dailyChallenge;
  } catch (error) {
    console.error("Error creating daily challenge:", error);
    throw new Error("Failed to create daily challenge");
  }
};
