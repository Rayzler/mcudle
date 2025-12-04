"use server";

import { prisma } from "@/lib/prisma";
import { SearchCharacterSchema } from "@/lib/validation";
import { Character } from "@/types/prisma";
import { ZodError } from "zod";
import { unstable_cache } from "next/cache";

/**
 * Cached search function - caches results per query
 * Results are cached for 7 days since character data is relatively static
 */
const getCharactersByQueryCached = unstable_cache(
  async (query: string, skip: string[] = []) => {
    try {
      // Validate inputs with Zod schema
      const validated = SearchCharacterSchema.parse({ query, skip });

      const characters = await prisma.character.findMany({
        where: {
          id: {
            notIn: validated.skip
          },
          name: {
            startsWith: validated.query,
            mode: "insensitive"
          }
        },
        select: {
          id: true,
          name: true,
          gender: true,
          species: true,
          status: true,
          firstAppearance: true,
          imageUrl: true,
          teams: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return characters as Character[];
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(
          "Validation error in getCharactersByQuery:",
          error.errors
        );
        throw new Error("Invalid search parameters");
      }

      console.error("Error fetching characters:", error);
      throw new Error("Failed to fetch characters");
    }
  },
  ["search-characters"],
  {
    revalidate: 604800, // 7 days in seconds
    tags: ["search-characters"]
  }
);

export const getCharactersByQuery = async (
  query: string,
  skip?: string[]
): Promise<Character[]> => {
  console.log(`[SEARCH CACHE] Searching for: "${query}"`);
  try {
    const result = await getCharactersByQueryCached(query, skip || []);
    console.log(
      `[SEARCH CACHE] Found ${result.length} characters for: "${query}"`
    );
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation error in getCharactersByQuery:", error.errors);
      throw new Error("Invalid search parameters");
    }

    console.error("Error fetching characters:", error);
    throw new Error("Failed to fetch characters");
  }
};
