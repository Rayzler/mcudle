import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getStreakData,
  updateStreakOnWin,
  getStreakForMode,
  getStatsForMode,
  resetStreakForMode,
  clearAllStreaks,
  subscribeToStreakUpdates
} from "./streakService";
import { GameMode } from "@/constants/enums";

// Helper to set a mocked date
const mockDate = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

const restoreDate = () => {
  vi.useRealTimers();
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});

describe("streakService", () => {
  beforeEach(() => {
    // Clear storage and listeners before each test
    localStorage.clear();
    // Reset real timers
    vi.useRealTimers();
  });

  it("should return default streaks when none saved", () => {
    const data = getStreakData();
    expect(data[GameMode.CLASSIC].current).toBe(0);
    expect(data[GameMode.CLASSIC].bestStreak).toBe(0);
  });

  it("should increment streak on consecutive days", () => {
    // Day 1
    mockDate("2025-12-01T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    let stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(1);

    // Day 2 (next UTC day)
    mockDate("2025-12-02T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(2);

    restoreDate();
  });

  it("should reset streak if days skipped", () => {
    // Day 1
    mockDate("2025-12-01T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    let stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(1);

    // Day 3 (skip day 2)
    mockDate("2025-12-03T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(1);

    restoreDate();
  });

  it("should not double count wins on the same UTC day", () => {
    mockDate("2025-12-04T02:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    updateStreakOnWin(GameMode.CLASSIC);
    const stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(1);
    expect(stats.totalWins).toBe(1);

    restoreDate();
  });

  it("should update bestStreak and totalWins", () => {
    mockDate("2025-12-01T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC); // 1

    mockDate("2025-12-02T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC); // 2

    mockDate("2025-12-03T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC); // reset to 1

    const stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.bestStreak).toBe(2);
    expect(stats.totalWins).toBe(3);

    restoreDate();
  });

  it("should notify subscribers on update", () => {
    mockDate("2025-12-01T12:00:00Z");
    const mockListener = vi.fn();
    const unsubscribe = subscribeToStreakUpdates(mockListener);

    updateStreakOnWin(GameMode.CLASSIC);
    expect(mockListener).toHaveBeenCalledWith(GameMode.CLASSIC);

    unsubscribe();
    mockListener.mockClear();

    updateStreakOnWin(GameMode.CLASSIC);
    expect(mockListener).not.toHaveBeenCalled();

    restoreDate();
  });

  it("should reset streak for mode but keep bestStreak and totalWins", () => {
    mockDate("2025-12-01T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    updateStreakOnWin(GameMode.CLASSIC); // same day second win should be ignored

    let stats = getStatsForMode(GameMode.CLASSIC);
    expect(stats.current).toBe(1);

    resetStreakForMode(GameMode.CLASSIC);
    stats = getStatsForMode(GameMode.CLASSIC);

    expect(stats.current).toBe(0);
    expect(stats.bestStreak).toBeGreaterThanOrEqual(1);

    restoreDate();
  });

  it("should clear all streaks from storage", () => {
    mockDate("2025-12-01T12:00:00Z");
    updateStreakOnWin(GameMode.CLASSIC);
    expect(localStorage.getItem("mcu-dle-streaks")).toBeTruthy();

    clearAllStreaks();
    expect(localStorage.getItem("mcu-dle-streaks")).toBeNull();

    restoreDate();
  });
});
