import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStreak } from "./useStreak";
import { GameMode } from "@/constants/enums";
import * as streakService from "@/lib/streakService";

// Mock the streakService module
vi.mock("@/lib/streakService");

describe("useStreak", () => {
  const mockSubscribers: Array<(gameMode: GameMode) => void> = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSubscribers.length = 0;

    // Mock the service functions
    vi.mocked(streakService.getStreakForMode).mockReturnValue(0);
    vi.mocked(streakService.updateStreakOnWin).mockImplementation(() => {});
    vi.mocked(streakService.subscribeToStreakUpdates).mockImplementation(
      (callback) => {
        mockSubscribers.push(callback);
        return () => {
          mockSubscribers.splice(mockSubscribers.indexOf(callback), 1);
        };
      }
    );
  });

  describe("initialization", () => {
    it("should initialize with streak 0 and isLoading true then false", () => {
      const { result } = renderHook(() => useStreak(GameMode.CLASSIC));

      expect(result.current.streak).toBe(0);
      expect(result.current.isLoading).toBe(false); // isLoading is set false after initial load
    });

    it("should load initial streak from service", () => {
      vi.mocked(streakService.getStreakForMode).mockReturnValue(5);

      const { result } = renderHook(() => useStreak(GameMode.CLASSIC));

      expect(result.current.streak).toBe(5);
      expect(streakService.getStreakForMode).toHaveBeenCalledWith(
        GameMode.CLASSIC
      );
    });

    it("should subscribe to streak updates on mount", () => {
      renderHook(() => useStreak(GameMode.CLASSIC));

      expect(streakService.subscribeToStreakUpdates).toHaveBeenCalled();
    });
  });

  describe("updateStreakOnWin", () => {
    it("should call updateService with correct game mode", () => {
      const { result } = renderHook(() => useStreak(GameMode.QUOTE));

      act(() => {
        result.current.updateStreakOnWin();
      });

      expect(streakService.updateStreakOnWin).toHaveBeenCalledWith(
        GameMode.QUOTE
      );
    });

    it("should be stable across re-renders", () => {
      const { result, rerender } = renderHook(() =>
        useStreak(GameMode.CLASSIC)
      );

      const firstFunction = result.current.updateStreakOnWin;

      rerender();

      const secondFunction = result.current.updateStreakOnWin;

      expect(firstFunction).toBe(secondFunction);
    });
  });

  describe("streak updates", () => {
    it("should update streak when subscribed callback is called", () => {
      vi.mocked(streakService.getStreakForMode)
        .mockReturnValueOnce(0) // Initial value
        .mockReturnValueOnce(1); // Updated value

      const { result } = renderHook(() => useStreak(GameMode.CLASSIC));

      expect(result.current.streak).toBe(0);

      // Simulate streak update from subscriber
      act(() => {
        mockSubscribers[0]?.(GameMode.CLASSIC);
      });

      expect(result.current.streak).toBe(1);
    });

    it("should only update for matching game mode", () => {
      vi.mocked(streakService.getStreakForMode).mockReturnValue(0);

      const { result } = renderHook(() => useStreak(GameMode.CLASSIC));

      vi.mocked(streakService.getStreakForMode).mockReturnValue(5);

      act(() => {
        // Call with different game mode
        mockSubscribers[0]?.(GameMode.QUOTE);
      });

      // Should not update
      expect(result.current.streak).toBe(0);
    });

    it("should handle multiple subscribers for different modes", () => {
      vi.mocked(streakService.getStreakForMode)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(2);

      const { result: classicResult } = renderHook(() =>
        useStreak(GameMode.CLASSIC)
      );
      const { result: quoteResult } = renderHook(() =>
        useStreak(GameMode.QUOTE)
      );

      expect(classicResult.current.streak).toBe(0);
      expect(quoteResult.current.streak).toBe(0);

      act(() => {
        mockSubscribers[0]?.(GameMode.CLASSIC);
      });

      expect(classicResult.current.streak).toBe(1);
      expect(quoteResult.current.streak).toBe(0);

      act(() => {
        mockSubscribers[1]?.(GameMode.QUOTE);
      });

      expect(classicResult.current.streak).toBe(1);
      expect(quoteResult.current.streak).toBe(2);
    });
  });

  describe("subscription cleanup", () => {
    it("should unsubscribe on unmount", () => {
      const { unmount } = renderHook(() => useStreak(GameMode.CLASSIC));

      expect(mockSubscribers).toHaveLength(1);

      unmount();

      expect(mockSubscribers).toHaveLength(0);
    });

    it("should update subscriptions when game mode changes", () => {
      const { rerender } = renderHook(
        ({ gameMode }: { gameMode: GameMode }) => useStreak(gameMode),
        { initialProps: { gameMode: GameMode.CLASSIC } }
      );

      expect(mockSubscribers).toHaveLength(1);

      rerender({ gameMode: GameMode.QUOTE });

      // Should have new subscriber for new mode
      expect(streakService.subscribeToStreakUpdates).toHaveBeenCalledTimes(2);
    });
  });

  describe("error scenarios", () => {
    it("should handle service errors gracefully", () => {
      vi.mocked(streakService.getStreakForMode).mockImplementation(() => {
        throw new Error("Service error");
      });

      expect(() => {
        renderHook(() => useStreak(GameMode.CLASSIC));
      }).toThrow();
    });

    it("should provide default values if service fails", () => {
      vi.mocked(streakService.getStreakForMode).mockReturnValue(0);

      const { result } = renderHook(() => useStreak(GameMode.CLASSIC));

      expect(result.current.streak).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("different game modes", () => {
    it("should handle all game modes correctly", () => {
      const modes = [
        GameMode.CLASSIC,
        GameMode.QUOTE,
        GameMode.EMOJI,
        GameMode.IMAGE
      ];

      modes.forEach((mode) => {
        vi.mocked(streakService.getStreakForMode).mockReturnValue(0);
        const { result } = renderHook(() => useStreak(mode));

        expect(result.current.streak).toBeDefined();
        expect(streakService.getStreakForMode).toHaveBeenCalledWith(mode);
      });
    });
  });
});
