import { mulberry32, xmur3 } from "./stringUtils";

export const getUTCDate = (): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

export const getYesterdayUTC = (): string => {
  const now = new Date();
  const utc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  utc.setUTCDate(utc.getUTCDate() - 1);
  return utc.toISOString().split("T")[0];
};

export function getDailyRandomElement<T>(arr: T[]): T {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(
      "getDailyRandomElement: input array must contain at least one element"
    );
  }
  const dateSeed = getUTCDate().toISOString().slice(0, 10); // YYYY-MM-DD
  const seedFn = xmur3(dateSeed);
  const rand = mulberry32(seedFn());
  const idx = Math.floor(rand() * arr.length);
  return arr[idx];
}
