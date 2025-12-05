import {
  getDailyChallenge,
  getLastDailyChallenge
} from "@/lib/dailyChallengeCache";
import { getAllCharactersForCache } from "@/lib/charactersCache";

/**
 * Pre-warms caches in the background without blocking rendering
 * This component runs async operations that populate Next.js cache
 * so subsequent requests on game mode pages are instant
 */
export default async function CachePrewarmer() {
  // Pre-warm caches in parallel
  await Promise.all([
    getDailyChallenge(),
    getLastDailyChallenge(),
    getAllCharactersForCache()
  ]).catch((error) => {
    console.error("Error pre-warming caches:", error);
  });

  // Return null - this component only exists to pre-warm cache
  return null;
}
