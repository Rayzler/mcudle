import { unstable_cache } from "next/cache";
import { getAllCharacters } from "@/actions/characters";

/**
 * Server-side cached version of getAllCharacters
 * Pre-loads all characters into cache for search optimization
 * This function is fire-and-forget in the layout to avoid blocking
 */
export const getAllCharactersForCache = unstable_cache(
  async () => {
    try {
      const result = await getAllCharacters();
      return result;
    } catch (error) {
      console.error("[Characters Cache] Error fetching characters:", error);
      return [];
    }
  },
  ["all-characters"],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ["all-characters"]
  }
);
