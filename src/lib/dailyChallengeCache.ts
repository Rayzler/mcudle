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
 *
 * Computed dynamically per-call to ensure revalidate and tags reflect current time
 */
export const getDailyChallenge = async () => {
  const todayISO = getUTCDate().toISOString().split("T")[0];
  const cachedFn = unstable_cache(
    async () => {
      const result = await fetchDailyChallenge();
      return result;
    },
    ["daily-challenge", todayISO],
    {
      revalidate: getSecondsUntilMidnightUTC(),
      tags: [`daily-challenge-${todayISO}`]
    }
  );
  return cachedFn();
};

/**
 * Server-side cached version of getLastDailyChallenge
 * Caches until next midnight UTC
 * Tag-based revalidation per day
 *
 * Computed dynamically per-call to ensure revalidate and tags reflect current time
 */
export const getLastDailyChallenge = async () => {
  const todayISO = getUTCDate().toISOString().split("T")[0];
  const cachedFn = unstable_cache(
    async () => {
      const result = await fetchLastDailyChallenge();
      return result;
    },
    ["last-daily-challenge", todayISO],
    {
      revalidate: getSecondsUntilMidnightUTC(),
      tags: [`last-daily-challenge-${todayISO}`]
    }
  );
  return cachedFn();
};
