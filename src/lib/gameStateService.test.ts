/**
 * Tests for gameStateService.ts
 * Covers game state persistence, validation, and edge cases
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  saveGameState,
  loadGameState,
  isGameStateSameDay,
  clearGameState,
  clearAllGameStates,
  GameState
} from "./gameStateService";
import { GameMode, getGameStateKey } from "@/constants/enums";
import { Character } from "@/types/prisma";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});

describe("gameStateService", () => {
  const mockCharacter: Character = {
    id: "char-123",
    name: "Spider-Man",
    emojis: "🕷️",
    gender: "male",
    species: "Human",
    status: "alive",
    firstAppearance: 2002,
    description: "Spider-Man",
    imageUrl: "https://example.com/spider-man.jpg",
    actorId: null
  };

  const mockGameState: GameState = {
    attempts: [mockCharacter],
    hasWon: false,
    characterId: "target-456",
    savedAt: new Date().toISOString()
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("saveGameState", () => {
    it("should save game state to localStorage", () => {
      saveGameState(GameMode.QUOTE, mockGameState);

      const key = getGameStateKey(GameMode.QUOTE);
      const stored = localStorage.getItem(key);

      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(mockGameState);
    });

    it("should overwrite existing game state", () => {
      const state1: GameState = {
        ...mockGameState,
        attempts: [mockCharacter]
      };

      const state2: GameState = {
        ...mockGameState,
        attempts: [mockCharacter, mockCharacter]
      };

      saveGameState(GameMode.EMOJI, state1);
      saveGameState(GameMode.EMOJI, state2);

      const key = getGameStateKey(GameMode.EMOJI);
      const stored = localStorage.getItem(key);
      const parsed = JSON.parse(stored!);

      expect(parsed.attempts).toHaveLength(2);
    });

    it("should save different game modes independently", () => {
      const quoteState: GameState = {
        ...mockGameState,
        savedAt: "2025-01-01T12:00:00Z"
      };
      const emojiState: GameState = {
        ...mockGameState,
        savedAt: "2025-01-02T12:00:00Z"
      };

      saveGameState(GameMode.QUOTE, quoteState);
      saveGameState(GameMode.EMOJI, emojiState);

      const quoteKey = getGameStateKey(GameMode.QUOTE);
      const emojiKey = getGameStateKey(GameMode.EMOJI);

      const quoteParsed = JSON.parse(localStorage.getItem(quoteKey)!);
      const emojiParsed = JSON.parse(localStorage.getItem(emojiKey)!);

      expect(quoteParsed.savedAt).toBe("2025-01-01T12:00:00Z");
      expect(emojiParsed.savedAt).toBe("2025-01-02T12:00:00Z");
    });

    it("should handle game states with empty attempts array", () => {
      const stateWithNoAttempts: GameState = {
        ...mockGameState,
        attempts: []
      };

      saveGameState(GameMode.IMAGE, stateWithNoAttempts);

      const key = getGameStateKey(GameMode.IMAGE);
      const stored = localStorage.getItem(key);
      const parsed = JSON.parse(stored!);

      expect(parsed.attempts).toEqual([]);
    });

    it("should handle game states with won=true", () => {
      const wonState: GameState = {
        ...mockGameState,
        hasWon: true,
        attempts: [mockCharacter, mockCharacter, mockCharacter]
      };

      saveGameState(GameMode.QUOTE, wonState);

      const key = getGameStateKey(GameMode.QUOTE);
      const stored = localStorage.getItem(key);
      const parsed = JSON.parse(stored!);

      expect(parsed.hasWon).toBe(true);
      expect(parsed.attempts).toHaveLength(3);
    });

    it("should not throw when called on server-side (no window)", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => saveGameState(GameMode.QUOTE, mockGameState)).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("loadGameState", () => {
    it("should load previously saved game state", () => {
      saveGameState(GameMode.QUOTE, mockGameState);

      const loaded = loadGameState(GameMode.QUOTE);

      expect(loaded).toEqual(mockGameState);
    });

    it("should return null when no state is saved", () => {
      const loaded = loadGameState(GameMode.EMOJI);

      expect(loaded).toBeNull();
    });

    it("should return null for different game modes independently", () => {
      saveGameState(GameMode.QUOTE, mockGameState);

      const loadedEmoji = loadGameState(GameMode.EMOJI);
      const loadedQuote = loadGameState(GameMode.QUOTE);

      expect(loadedEmoji).toBeNull();
      expect(loadedQuote).toEqual(mockGameState);
    });

    it("should handle corrupted JSON in localStorage gracefully", () => {
      const key = getGameStateKey(GameMode.IMAGE);
      localStorage.setItem(key, "{ invalid json }");

      const loaded = loadGameState(GameMode.IMAGE);

      expect(loaded).toBeNull();
    });

    it("should handle empty string in localStorage", () => {
      const key = getGameStateKey(GameMode.QUOTE);
      localStorage.setItem(key, "");

      const loaded = loadGameState(GameMode.QUOTE);

      expect(loaded).toBeNull();
    });

    it("should return null on server-side (no window)", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const loaded = loadGameState(GameMode.QUOTE);

      expect(loaded).toBeNull();

      global.window = originalWindow;
    });

    it("should restore complex character objects", () => {
      const complexCharacter: Character = {
        id: "char-complex",
        name: "Iron Man",
        emojis: "🤖",
        gender: "male",
        species: "Human",
        status: "alive",
        firstAppearance: 2008,
        description: "Iron Man",
        imageUrl: "https://example.com/iron-man.jpg",
        actorId: null
      };

      const stateWithComplex: GameState = {
        attempts: [complexCharacter, mockCharacter],
        hasWon: false,
        characterId: "target-123",
        savedAt: new Date().toISOString()
      };

      saveGameState(GameMode.QUOTE, stateWithComplex);
      const loaded = loadGameState(GameMode.QUOTE);

      expect(loaded?.attempts).toHaveLength(2);
      expect(loaded?.attempts[0]).toEqual(complexCharacter);
      expect(loaded?.attempts[1]).toEqual(mockCharacter);
    });
  });

  describe("isGameStateSameDay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return true if state is from today and character matches", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const todayState: GameState = {
        ...mockGameState,
        characterId: "current-char",
        savedAt: new Date("2025-12-04T10:00:00Z").toISOString()
      };

      saveGameState(GameMode.QUOTE, todayState);

      const isSameDay = isGameStateSameDay(GameMode.QUOTE, "current-char");

      expect(isSameDay).toBe(true);
    });

    it("should return false if character ID doesn't match", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const todayState: GameState = {
        ...mockGameState,
        characterId: "char-A",
        savedAt: new Date("2025-12-04T10:00:00Z").toISOString()
      };

      saveGameState(GameMode.QUOTE, todayState);

      const isSameDay = isGameStateSameDay(GameMode.QUOTE, "char-B");

      expect(isSameDay).toBe(false);
    });

    it("should return false if state is from yesterday", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const yesterdayState: GameState = {
        ...mockGameState,
        characterId: "current-char",
        savedAt: new Date("2025-12-03T12:00:00Z").toISOString()
      };

      saveGameState(GameMode.EMOJI, yesterdayState);

      const isSameDay = isGameStateSameDay(GameMode.EMOJI, "current-char");

      expect(isSameDay).toBe(false);
    });

    it("should return false if no state is saved", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const isSameDay = isGameStateSameDay(GameMode.IMAGE, "any-char");

      expect(isSameDay).toBe(false);
    });

    it("should be case-sensitive for character ID comparison", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const todayState: GameState = {
        ...mockGameState,
        characterId: "CHAR-ABC",
        savedAt: new Date("2025-12-04T10:00:00Z").toISOString()
      };

      saveGameState(GameMode.QUOTE, todayState);

      const isSameDayLower = isGameStateSameDay(GameMode.QUOTE, "char-abc");
      const isSameDayUpper = isGameStateSameDay(GameMode.QUOTE, "CHAR-ABC");

      expect(isSameDayLower).toBe(false);
      expect(isSameDayUpper).toBe(true);
    });

    it("should handle date boundaries correctly", () => {
      // isGameStateSameDay uses toDateString() which is local time, not UTC
      // Set to a date where we can control the local date
      const earlyMorning = new Date("2025-12-04");
      earlyMorning.setHours(2, 0, 0, 0); // 2 AM local time
      vi.setSystemTime(earlyMorning);

      const lateState: GameState = {
        ...mockGameState,
        characterId: "char-id",
        savedAt: new Date().toISOString()
      };
      saveGameState(GameMode.QUOTE, lateState);

      const nextDay = new Date("2025-12-05");
      nextDay.setHours(2, 0, 0, 0);
      vi.setSystemTime(nextDay);

      const isSameDay = isGameStateSameDay(GameMode.QUOTE, "char-id");

      expect(isSameDay).toBe(false);
    });

    it("should return true for state saved at any time today", () => {
      // isGameStateSameDay uses toDateString() which is local time
      const baseDate = new Date("2025-12-04");
      baseDate.setHours(12, 0, 0, 0); // Set to noon local time on Dec 4
      vi.setSystemTime(baseDate);

      // Save at different local times within the same day
      const savedState: GameState = {
        ...mockGameState,
        characterId: "same-char",
        savedAt: new Date().toISOString()
      };
      saveGameState(GameMode.QUOTE, savedState);

      // Check at different local times on the same day
      const times = [0, 6, 12, 18, 23]; // Different hours within Dec 4

      times.forEach((hour) => {
        const checkDate = new Date("2025-12-04");
        checkDate.setHours(hour, 30, 45, 0);
        vi.setSystemTime(checkDate);

        const isSameDay = isGameStateSameDay(GameMode.QUOTE, "same-char");
        expect(isSameDay).toBe(true);
      });
    });
  });

  describe("clearGameState", () => {
    it("should remove game state from localStorage", () => {
      saveGameState(GameMode.QUOTE, mockGameState);

      clearGameState(GameMode.QUOTE);

      const loaded = loadGameState(GameMode.QUOTE);
      expect(loaded).toBeNull();
    });

    it("should only clear the specified game mode", () => {
      saveGameState(GameMode.QUOTE, mockGameState);
      saveGameState(GameMode.EMOJI, mockGameState);

      clearGameState(GameMode.QUOTE);

      const quoteLoaded = loadGameState(GameMode.QUOTE);
      const emojiLoaded = loadGameState(GameMode.EMOJI);

      expect(quoteLoaded).toBeNull();
      expect(emojiLoaded).toEqual(mockGameState);
    });

    it("should not throw when clearing non-existent state", () => {
      expect(() => clearGameState(GameMode.IMAGE)).not.toThrow();
    });

    it("should not throw on server-side (no window)", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => clearGameState(GameMode.QUOTE)).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("clearAllGameStates", () => {
    it("should remove all game mode states", () => {
      saveGameState(GameMode.QUOTE, mockGameState);
      saveGameState(GameMode.EMOJI, mockGameState);
      saveGameState(GameMode.IMAGE, mockGameState);

      clearAllGameStates();

      expect(loadGameState(GameMode.QUOTE)).toBeNull();
      expect(loadGameState(GameMode.EMOJI)).toBeNull();
      expect(loadGameState(GameMode.IMAGE)).toBeNull();
    });

    it("should not throw when clearing empty states", () => {
      expect(() => clearAllGameStates()).not.toThrow();
    });

    it("should not throw on server-side (no window)", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => clearAllGameStates()).not.toThrow();

      global.window = originalWindow;
    });

    it("should clear all states even if some modes have no data", () => {
      // Save state for only some modes
      saveGameState(GameMode.QUOTE, mockGameState);

      clearAllGameStates();

      expect(loadGameState(GameMode.QUOTE)).toBeNull();
      expect(loadGameState(GameMode.EMOJI)).toBeNull();
      expect(loadGameState(GameMode.IMAGE)).toBeNull();
    });
  });

  describe("Integration tests", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should persist and restore a full game session", () => {
      vi.setSystemTime(new Date("2025-12-04T12:00:00Z"));

      const initialState: GameState = {
        attempts: [mockCharacter],
        hasWon: false,
        characterId: "target-123",
        savedAt: new Date().toISOString()
      };

      // Save
      saveGameState(GameMode.QUOTE, initialState);

      // Simulate page reload
      const loaded = loadGameState(GameMode.QUOTE);

      expect(loaded).toEqual(initialState);
      expect(isGameStateSameDay(GameMode.QUOTE, "target-123")).toBe(true);
    });

    it("should handle multiple game modes simultaneously", () => {
      const quoteState: GameState = {
        ...mockGameState,
        characterId: "quote-target"
      };

      const emojiState: GameState = {
        ...mockGameState,
        characterId: "emoji-target",
        attempts: [mockCharacter, mockCharacter]
      };

      saveGameState(GameMode.QUOTE, quoteState);
      saveGameState(GameMode.EMOJI, emojiState);

      expect(loadGameState(GameMode.QUOTE)).toEqual(quoteState);
      expect(loadGameState(GameMode.EMOJI)).toEqual(emojiState);
      expect(isGameStateSameDay(GameMode.QUOTE, "quote-target")).toBe(true);
      expect(isGameStateSameDay(GameMode.EMOJI, "emoji-target")).toBe(true);
    });

    it("should detect when a new day starts and invalidate state", () => {
      // isGameStateSameDay uses toDateString() which is local time
      const day1 = new Date("2025-12-04");
      day1.setHours(23, 59, 59, 0); // 23:59:59 local time on Dec 4
      vi.setSystemTime(day1);

      const stateFromDay1: GameState = {
        ...mockGameState,
        characterId: "char-123",
        savedAt: new Date().toISOString()
      };

      saveGameState(GameMode.QUOTE, stateFromDay1);
      expect(isGameStateSameDay(GameMode.QUOTE, "char-123")).toBe(true);

      // Advance to next local day
      const day2 = new Date("2025-12-05");
      day2.setHours(0, 0, 1, 0); // 00:00:01 local time on Dec 5
      vi.setSystemTime(day2);

      expect(isGameStateSameDay(GameMode.QUOTE, "char-123")).toBe(false);
    });
  });
});
