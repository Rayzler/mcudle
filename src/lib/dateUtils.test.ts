/**
 * Tests for dateUtils.ts
 * Covers UTC date generation, yesterday calculation, and deterministic daily random selection
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getUTCDate,
  getYesterdayUTC,
  getDailyRandomElement
} from "./dateUtils";

describe("dateUtils", () => {
  describe("getUTCDate", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return a Date at midnight UTC for the current day", () => {
      // Set time to 2025-06-15 14:30:45 UTC
      vi.setSystemTime(new Date("2025-06-15T14:30:45Z"));

      const result = getUTCDate();

      expect(result.toISOString()).toBe("2025-06-15T00:00:00.000Z");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
    });

    it("should return same UTC date regardless of local timezone offset", () => {
      // Simulate different times that are the same UTC day but different local days
      vi.setSystemTime(new Date("2025-12-04T23:59:59Z"));
      const result1 = getUTCDate();

      vi.setSystemTime(new Date("2025-12-04T00:00:01Z"));
      const result2 = getUTCDate();

      expect(result1.toISOString()).toBe("2025-12-04T00:00:00.000Z");
      expect(result2.toISOString()).toBe("2025-12-04T00:00:00.000Z");
      expect(result1.getTime()).toBe(result2.getTime());
    });

    it("should handle date transitions correctly at midnight UTC", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
      const newYear = getUTCDate();

      vi.setSystemTime(new Date("2024-12-31T23:59:59Z"));
      const oldYear = getUTCDate();

      expect(newYear.toISOString()).toBe("2025-01-01T00:00:00.000Z");
      expect(oldYear.toISOString()).toBe("2024-12-31T00:00:00.000Z");
    });
  });

  describe("getYesterdayUTC", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return yesterday's date in YYYY-MM-DD format", () => {
      vi.setSystemTime(new Date("2025-06-15T14:30:45Z"));

      const result = getYesterdayUTC();

      expect(result).toBe("2025-06-14");
    });

    it("should handle month transitions", () => {
      vi.setSystemTime(new Date("2025-07-01T12:00:00Z"));

      const result = getYesterdayUTC();

      expect(result).toBe("2025-06-30");
    });

    it("should handle year transitions", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));

      const result = getYesterdayUTC();

      expect(result).toBe("2024-12-31");
    });

    it("should handle leap year correctly", () => {
      vi.setSystemTime(new Date("2024-03-01T12:00:00Z"));

      const result = getYesterdayUTC();

      expect(result).toBe("2024-02-29");
    });

    it("should be consistent regardless of local timezone", () => {
      // Near midnight UTC, different local timezones should still get same UTC yesterday
      vi.setSystemTime(new Date("2025-06-15T00:30:00Z"));
      const result1 = getYesterdayUTC();

      vi.setSystemTime(new Date("2025-06-15T23:30:00Z"));
      const result2 = getYesterdayUTC();

      expect(result1).toBe("2025-06-14");
      expect(result2).toBe("2025-06-14");
    });
  });

  describe("getDailyRandomElement", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return the same element for the same day", () => {
      const testArray = ["a", "b", "c", "d", "e"];

      vi.setSystemTime(new Date("2025-06-15T08:00:00Z"));
      const result1 = getDailyRandomElement(testArray);

      vi.setSystemTime(new Date("2025-06-15T20:00:00Z"));
      const result2 = getDailyRandomElement(testArray);

      expect(result1).toBe(result2);
    });

    it("should return different elements for different days", () => {
      const testArray = ["a", "b", "c", "d", "e"];

      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
      const day1 = getDailyRandomElement(testArray);

      vi.setSystemTime(new Date("2025-06-16T12:00:00Z"));
      const day2 = getDailyRandomElement(testArray);

      vi.setSystemTime(new Date("2025-06-17T12:00:00Z"));
      const day3 = getDailyRandomElement(testArray);

      // At least one should be different (deterministic but varies by day)
      const allSame = day1 === day2 && day2 === day3;
      expect(allSame).toBe(false);
    });

    it("should always return an element from the input array", () => {
      const testArray = [10, 20, 30, 40, 50];

      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
      const result = getDailyRandomElement(testArray);

      expect(testArray).toContain(result);
    });

    it("should handle single-element arrays", () => {
      const testArray = ["only"];

      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
      const result = getDailyRandomElement(testArray);

      expect(result).toBe("only");
    });

    it("should work with arrays of objects", () => {
      const testArray = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
      ];

      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
      const result = getDailyRandomElement(testArray);

      expect(testArray).toContainEqual(result);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
    });

    it("should throw an error when given an empty array", () => {
      const emptyArray: string[] = [];

      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

      expect(() => getDailyRandomElement(emptyArray)).toThrow(
        "getDailyRandomElement: input array must contain at least one element"
      );
    });

    it("should throw an error when given null or undefined", () => {
      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

      expect(() => getDailyRandomElement(null as any)).toThrow();
      expect(() => getDailyRandomElement(undefined as any)).toThrow();
    });

    it("should produce deterministic results based on date seed", () => {
      const testArray = ["alpha", "beta", "gamma", "delta", "epsilon"];

      // Run the same date multiple times
      vi.setSystemTime(new Date("2025-06-15T10:00:00Z"));
      const results: string[] = [];

      for (let i = 0; i < 10; i++) {
        results.push(getDailyRandomElement(testArray));
      }

      // All results should be identical
      const allSame = results.every((r) => r === results[0]);
      expect(allSame).toBe(true);
    });

    it("should be consistent across different times on the same UTC day", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const times = [
        "2025-12-04T00:00:00Z",
        "2025-12-04T06:30:15Z",
        "2025-12-04T12:00:00Z",
        "2025-12-04T18:45:30Z",
        "2025-12-04T23:59:59Z"
      ];

      const results = times.map((time) => {
        vi.setSystemTime(new Date(time));
        return getDailyRandomElement(testArray);
      });

      // All should be the same
      const firstResult = results[0];
      expect(results.every((r) => r === firstResult)).toBe(true);
    });

    it("should distribute selections across the array over multiple days", () => {
      const testArray = ["A", "B", "C", "D", "E"];
      const selections = new Set<string>();

      // Simulate 100 different days
      for (let day = 1; day <= 100; day++) {
        vi.setSystemTime(
          new Date(`2025-01-${String(day).padStart(2, "0")}T12:00:00Z`)
        );
        const selected = getDailyRandomElement(testArray);
        selections.add(selected);
      }

      // Over 100 days, we should see multiple different elements selected
      // (Not necessarily all, but at least more than 1)
      expect(selections.size).toBeGreaterThan(1);
    });
  });
});
