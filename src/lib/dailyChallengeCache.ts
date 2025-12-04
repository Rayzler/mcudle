import { unstable_cache } from "next/cache";
import {
  getDailyChallenge as fetchDailyChallenge,
  getLastDailyChallenge as fetchLastDailyChallenge
} from "@/actions/dailyChallenge";
import { getUTCDate } from "./dateUtils";

/**
 * Calculate seconds until next midnight UTC
 */
const getSecondsUntilMidnightUTC = (): number => {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  );
  const secondsUntilMidnight = Math.ceil(
    (tomorrow.getTime() - now.getTime()) / 1000
  );
  return secondsUntilMidnight;
};

/**
 * Server-side cached version of getDailyChallenge
 * Caches until next midnight UTC
 * Tag-based revalidation per day
 */
export const getDailyChallenge = unstable_cache(
  async () => {
    console.log("[CACHE] Fetching daily challenge from database...");
    const result = await fetchDailyChallenge();
    console.log("[CACHE] Daily challenge fetched from database");
    return result;
  },
  ["daily-challenge"],
  {
    revalidate: getSecondsUntilMidnightUTC(),
    tags: [`daily-challenge-${getUTCDate().toISOString().split("T")[0]}`]
  }
);

/**
 * Server-side cached version of getLastDailyChallenge
 * Caches until next midnight UTC
 * Tag-based revalidation per day
 */
export const getLastDailyChallenge = unstable_cache(
  async () => {
    console.log("[CACHE] Fetching last daily challenge from database...");
    const result = await fetchLastDailyChallenge();
    console.log("[CACHE] Last daily challenge fetched from database");
    return result;
  },
  ["last-daily-challenge"],
  {
    revalidate: getSecondsUntilMidnightUTC(),
    tags: [`last-daily-challenge-${getUTCDate().toISOString().split("T")[0]}`]
  }
);
