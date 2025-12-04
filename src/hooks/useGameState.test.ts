import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameState } from "./useGameState";
import { GameMode } from "@/constants/enums";
import * as gameStateService from "@/lib/gameStateService";

// Mock the gameStateService module
vi.mock("@/lib/gameStateService");

const mockCharacter: any = {
  id: "char-1",
  name: "Test Character",
  species: "Human",
  gender: "male",
  status: "alive",
  firstAppearance: 2012,
  imageUrl: "http://example.com/image.jpg",
  description: "Test description",
  emojis: "🎭",
  actorId: "actor-1",
  teams: [],
  quote: null
};

describe("useGameState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the service functions
    vi.mocked(gameStateService.isGameStateSameDay).mockReturnValue(true);
    vi.mocked(gameStateService.loadGameState).mockReturnValue(null);
    vi.mocked(gameStateService.saveGameState).mockImplementation(() => {});
    vi.mocked(gameStateService.clearGameState).mockImplementation(() => {});
  });

  describe("initialization", () => {
    it("should initialize with empty attempts and hasWon false", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      expect(result.current.attempts).toEqual([]);
      expect(result.current.hasWon).toBe(false);
      expect(result.current.showQuote).toBe(false);
      expect(result.current.showImage).toBe(false);
    });

    it("should load saved game state if same day", () => {
      const savedState = {
        attempts: [mockCharacter],
        hasWon: false,
        characterId: "char-1",
        savedAt: new Date().toISOString()
      };

      vi.mocked(gameStateService.loadGameState).mockReturnValue(savedState);

      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      expect(result.current.attempts).toEqual([mockCharacter]);
    });

    it("should not load saved state if different day", () => {
      vi.mocked(gameStateService.isGameStateSameDay).mockReturnValue(false);

      const savedState = {
        attempts: [mockCharacter],
        hasWon: false,
        characterId: "char-1",
        savedAt: new Date().toISOString()
      };

      vi.mocked(gameStateService.loadGameState).mockReturnValue(savedState);

      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      expect(result.current.attempts).toEqual([]);
    });
  });

  describe("addAttempt", () => {
    it("should add attempt to the beginning of attempts array", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      act(() => {
        result.current.addAttempt(mockCharacter);
      });

      expect(result.current.attempts).toHaveLength(1);
      expect(result.current.attempts[0]).toEqual(mockCharacter);
    });

    it("should prepend new attempt to existing attempts", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      const firstAttempt = { ...mockCharacter, id: "char-1" };
      const secondAttempt = { ...mockCharacter, id: "char-2" };

      act(() => {
        result.current.addAttempt(firstAttempt);
        result.current.addAttempt(secondAttempt);
      });

      expect(result.current.attempts).toHaveLength(2);
      expect(result.current.attempts[0].id).toBe("char-2");
      expect(result.current.attempts[1].id).toBe("char-1");
    });

    it("should save game state after adding attempt", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      act(() => {
        result.current.addAttempt(mockCharacter);
      });

      expect(gameStateService.saveGameState).toHaveBeenCalled();
    });
  });

  describe("toggleQuote", () => {
    it("should toggle showQuote state", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.QUOTE, "char-1")
      );

      expect(result.current.showQuote).toBe(false);

      act(() => {
        result.current.toggleQuote();
      });

      expect(result.current.showQuote).toBe(true);

      act(() => {
        result.current.toggleQuote();
      });

      expect(result.current.showQuote).toBe(false);
    });

    it("should close showImage when opening showQuote", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.QUOTE, "char-1")
      );

      act(() => {
        result.current.toggleImage();
      });

      expect(result.current.showImage).toBe(true);

      act(() => {
        result.current.toggleQuote();
      });

      expect(result.current.showQuote).toBe(true);
      expect(result.current.showImage).toBe(false);
    });
  });

  describe("toggleImage", () => {
    it("should toggle showImage state", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.IMAGE, "char-1")
      );

      expect(result.current.showImage).toBe(false);

      act(() => {
        result.current.toggleImage();
      });

      expect(result.current.showImage).toBe(true);

      act(() => {
        result.current.toggleImage();
      });

      expect(result.current.showImage).toBe(false);
    });

    it("should close showQuote when opening showImage", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.IMAGE, "char-1")
      );

      act(() => {
        result.current.toggleQuote();
      });

      expect(result.current.showQuote).toBe(true);

      act(() => {
        result.current.toggleImage();
      });

      expect(result.current.showImage).toBe(true);
      expect(result.current.showQuote).toBe(false);
    });
  });

  describe("win", () => {
    it("should set hasWon to true", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      expect(result.current.hasWon).toBe(false);

      act(() => {
        result.current.win();
      });

      expect(result.current.hasWon).toBe(true);
    });

    it("should clear game state on win", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      act(() => {
        result.current.win();
      });

      expect(gameStateService.clearGameState).toHaveBeenCalledWith(
        GameMode.CLASSIC
      );
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      act(() => {
        result.current.addAttempt(mockCharacter);
        result.current.win();
        result.current.toggleQuote();
      });

      expect(result.current.attempts).toHaveLength(1);
      expect(result.current.hasWon).toBe(true);
      expect(result.current.showQuote).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.attempts).toEqual([]);
      expect(result.current.hasWon).toBe(false);
      expect(result.current.showQuote).toBe(false);
      expect(result.current.showImage).toBe(false);
    });

    it("should clear game state on reset", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      act(() => {
        result.current.reset();
      });

      expect(gameStateService.clearGameState).toHaveBeenCalledWith(
        GameMode.CLASSIC
      );
    });
  });

  describe("state persistence", () => {
    it("should save state only after initial load", () => {
      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      vi.mocked(gameStateService.saveGameState).mockClear();

      act(() => {
        result.current.addAttempt(mockCharacter);
      });

      expect(gameStateService.saveGameState).toHaveBeenCalled();
    });

    it("should track initial attempts count correctly", () => {
      const savedState = {
        attempts: [mockCharacter, mockCharacter],
        hasWon: false,
        characterId: "char-1",
        savedAt: new Date().toISOString()
      };

      vi.mocked(gameStateService.loadGameState).mockReturnValue(savedState);

      const { result } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      expect(result.current.attempts).toHaveLength(2);
    });
  });

  describe("different game modes", () => {
    it("should handle different game modes independently", () => {
      const { result: classicResult } = renderHook(() =>
        useGameState(GameMode.CLASSIC, "char-1")
      );

      const { result: quoteResult } = renderHook(() =>
        useGameState(GameMode.QUOTE, "char-1")
      );

      act(() => {
        classicResult.current.addAttempt(mockCharacter);
      });

      expect(classicResult.current.attempts).toHaveLength(1);
      expect(quoteResult.current.attempts).toHaveLength(0);
    });
  });
});
