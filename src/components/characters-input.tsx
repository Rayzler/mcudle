"use client";

import { getCachedCharacters } from "@/lib/charactersCache-server";
import { useDebounce } from "@/hooks/useDebounce";
import { Character } from "@/types/prisma";
import { useEffect, useState, useRef } from "react";

type Props = {
  selectedIds?: string[];
  onCharacterSelected: (character: Character) => void;
  disabled?: boolean;
};

const CharactersInput = ({
  onCharacterSelected,
  selectedIds,
  disabled = false
}: Props) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const allCharactersRef = useRef<Character[] | null>(null);

  // Load all characters from cache on mount
  useEffect(() => {
    let isMounted = true;

    const loadCharacters = async () => {
      if (!allCharactersRef.current) {
        if (isMounted) {
          setIsLoading(true);
        }
        try {
          const cachedCharacters = await getCachedCharacters();
          if (isMounted) {
            allCharactersRef.current = cachedCharacters;
          }
        } catch (error) {
          console.error("Error loading characters:", error);
          if (isMounted) {
            allCharactersRef.current = [];
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    loadCharacters();

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce the input value
  const debouncedQuery = useDebounce(inputValue, 150);

  // Filter characters locally when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || !inputValue.trim()) {
      setCharacters([]);
      return;
    }

    if (!allCharactersRef.current) {
      setCharacters([]);
      return;
    }

    // Filter locally from cached characters
    const filtered = allCharactersRef.current.filter((char) => {
      // Exclude already selected characters
      if (selectedIds?.includes(char.id)) {
        return false;
      }

      // Match by name
      return char.name.toLowerCase().startsWith(debouncedQuery.toLowerCase());
    });

    setCharacters(filtered);
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
      {inputValue.trim() && (characters.length > 0 || isLoading) && (
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
