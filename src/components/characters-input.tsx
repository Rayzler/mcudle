"use client";

import { getCharactersByQuery } from "@/actions/characters";
import { useDebounce } from "@/hooks/useDebounce";
import { Character } from "@/types/prisma";
import { useEffect, useState, useRef } from "react";

type Props = {
  selectedIds?: string[];
  onCharacterSelected: (character: Character) => void;
  disabled?: boolean;
};

// Client-side cache for recent searches (1 hour)
const searchCache = new Map<
  string,
  { results: Character[]; timestamp: number }
>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

const getCachedResults = (query: string): Character[] | null => {
  const cached = searchCache.get(query);
  if (!cached) return null;

  // Check if cache is still valid
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    searchCache.delete(query);
    return null;
  }

  return cached.results;
};

const setCachedResults = (query: string, results: Character[]): void => {
  searchCache.set(query, { results, timestamp: Date.now() });
};

const CharactersInput = ({
  onCharacterSelected,
  selectedIds,
  disabled = false
}: Props) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Track the latest query to prevent stale responses
  const latestQueryRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce the input value to reduce queries - reduced to 100ms since we have cache
  const debouncedQuery = useDebounce(inputValue, 100);

  // Perform search when debounced value changes
  useEffect(() => {
    if (!debouncedQuery || !inputValue.trim()) {
      setCharacters([]);
      latestQueryRef.current = "";
      return;
    }

    // Update the latest query
    latestQueryRef.current = debouncedQuery;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const currentQuery = debouncedQuery;

    // Check client-side cache first and show immediately
    const cachedResults = getCachedResults(currentQuery);
    if (cachedResults !== null) {
      setCharacters(cachedResults);
      setIsLoading(false);
      return;
    }

    // No cache, show loading while fetching
    setCharacters([]);
    setIsLoading(true);

    const performSearch = async () => {
      try {
        const response = await getCharactersByQuery(currentQuery, selectedIds);

        // Only update UI if this is still the latest query
        if (latestQueryRef.current === currentQuery) {
          // Store in client cache
          setCachedResults(currentQuery, response);
          setCharacters(response);
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Search error:", error);
        // Only clear on error if it's the latest query
        if (latestQueryRef.current === currentQuery) {
          setCharacters([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, selectedIds]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const query = event.target.value;
    setInputValue(query);
    // Clear characters immediately when user clears the input
    if (!query.trim()) {
      setCharacters([]);
    }
  };

  const handleCharacterSelected = (character: Character) => {
    setInputValue("");
    setCharacters([]);
    onCharacterSelected(character);
  };

  return (
    <div className="max-w-md relative w-full mx-auto">
      <input
        type="text"
        placeholder="Type character name..."
        name="query"
        autoComplete="off"
        value={inputValue}
        disabled={disabled}
        className={`peer bg-gradient-to-b from-neutral-900 to-neutral-800 w-full border-2 rounded-md px-5 py-3 text-white outline-0 box-reflect placeholder:text-neutral-500 focus:bg-gradient-to-t focus:animate-red-glow ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onChange={handleInputChange}
      />
      {(characters.length > 0 || isLoading) && (
        <div className="mt-2.5 bg-neutral-800 rounded-md max-h-60 overflow-y-auto box-reflect-mask w-full absolute z-20">
          {isLoading && characters.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-400 border-t-red-500"></div>
            </div>
          ) : (
            <ul>
              {characters.map((character) => (
                <li key={character.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50"
                    onClick={() => handleCharacterSelected(character)}
                  >
                    <img
                      src={
                        character.imageUrl || "/images/portrait_placeholder.png"
                      }
                      alt={character.name}
                      className="w-10 h-10 aspect-square object-cover object-top"
                    />
                    {character.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CharactersInput;
