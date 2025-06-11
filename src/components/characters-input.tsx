"use client";

import { getCharactersByQuery } from "@/actions/characters";
import { Character } from "@/types/prisma";
import { useState } from "react";

type Props = {
  selectedIds?: string[];
  onCharacterSelected: (character: Character) => void;
};

const CharactersInput = ({ onCharacterSelected, selectedIds }: Props) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    if (!query) {
      setCharacters([]);
      return;
    }

    const response = await getCharactersByQuery(query, selectedIds);
    setCharacters(response);
  };

  const handleCharacterSelected = (character: Character) => {
    setInputValue("");
    setCharacters([]);
    onCharacterSelected(character);
  };

  return (
    <div className="w-96 relative">
      <input
        type="text"
        placeholder="Type character name..."
        name="query"
        autoComplete="off"
        value={inputValue}
        className="peer bg-gradient-to-b from-neutral-900 to-neutral-800 w-full border-2 rounded-md px-5 py-3 text-white outline-0 box-reflect placeholder:text-neutral-500 focus:bg-gradient-to-t focus:animate-red-glow"
        onChange={handleSearch}
      />
      {characters.length > 0 && (
        <ul className="mt-2.5 bg-neutral-800 rounded-md max-h-60 overflow-y-auto box-reflect-mask w-full absolute z-20">
          {characters.map((character) => (
            <li key={character.id}>
              <button
                className="w-full text-left px-4 py-3 hover:bg-neutral-700 flex items-center gap-2"
                onClick={() => handleCharacterSelected(character)}
              >
                <img
                  src={
                    character.imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
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
  );
};

export default CharactersInput;
