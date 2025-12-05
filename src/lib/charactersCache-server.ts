"use server";

import { getAllCharactersForCache } from "./charactersCache";

/**
 * Server Action wrapper to allow calling unstable_cache from client components.
 * This must be in a separate file with "use server" at the top.
 */
export async function getCachedCharacters() {
  return getAllCharactersForCache();
}
