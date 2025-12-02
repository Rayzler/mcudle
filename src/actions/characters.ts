"use server";

import { prisma } from "@/lib/prisma";
import { SearchCharacterSchema } from "@/lib/validation";
import { Character } from "@/types/prisma";
import { ZodError } from "zod";

export const getCharactersByQuery = async (
  query: string,
  skip?: string[]
): Promise<Character[]> => {
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
      },
    });

    return characters as Character[];
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation error in getCharactersByQuery:", error.errors);
      throw new Error("Invalid search parameters");
    }

    console.error("Error fetching characters:", error);
    throw new Error("Failed to fetch characters");
  }
};
