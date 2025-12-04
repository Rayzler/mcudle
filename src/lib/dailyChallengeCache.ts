import { cache } from "react";
import {
  getDailyChallenge as fetchDailyChallenge,
  getLastDailyChallenge as fetchLastDailyChallenge
} from "@/actions/dailyChallenge";

/**
 * Server-side cached version of getDailyChallenge
 * Caches the result for the duration of the request
 * Automatically invalidates on new day
 */
export const getDailyChallenge = cache(async () => {
  return await fetchDailyChallenge();
});

/**
 * Server-side cached version of getLastDailyChallenge
 * Caches the result for the duration of the request
 */
export const getLastDailyChallenge = cache(async () => {
  return await fetchLastDailyChallenge();
});
