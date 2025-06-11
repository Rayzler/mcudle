"use server";

import { prisma } from "@/lib/prisma";
import { Character } from "@/types/prisma";

export const getCharactersByQuery = async (query: string, skip?: string[]): Promise<Character[]> => {
  const characters = await prisma.character.findMany({
    where: {
      id: {
        notIn: skip || []
      },
      name: {
        startsWith: query,
        mode: "insensitive"
      }
    },
    include: {
      teams: true
    }
  });

  return characters;
};
