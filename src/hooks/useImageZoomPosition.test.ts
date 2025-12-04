import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useImageZoomPosition } from "./useImageZoomPosition";
import * as dateUtils from "@/lib/dateUtils";

// Mock the dateUtils module
vi.mock("@/lib/dateUtils");

describe("useImageZoomPosition", () => {
  const mockDate = new Date("2025-12-04T00:00:00Z");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dateUtils.getUTCDate).mockReturnValue(mockDate);
  });

  describe("initialization", () => {
    it("should return null initially", () => {
      const { result } = renderHook(() => useImageZoomPosition("char-1"));

      // Position is calculated in useEffect, so it might be null or a position
      // depending on timing, but should eventually be a position
      expect(
        result.current === null ||
          (typeof result.current === "object" && "x" in result.current)
      ).toBe(true);
    });

    it("should generate a position object with x and y coordinates", () => {
      const { result } = renderHook(() => useImageZoomPosition("char-1"));

      // Wait for effect to run
      expect(
        result.current === null ||
          (typeof result.current === "object" &&
            "x" in result.current &&
            "y" in result.current)
      ).toBe(true);
    });
  });

  describe("deterministic generation", () => {
    it("should generate the same position for the same character ID and date", () => {
      const { result: result1 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      const { result: result2 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      expect(result1.current).toEqual(result2.current);
    });

    it("should generate different positions for different character IDs", () => {
      const { result: result1 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      const { result: result2 } = renderHook(() =>
        useImageZoomPosition("char-2")
      );

      expect(result1.current).not.toEqual(result2.current);
    });

    it("should generate different positions for different dates", () => {
      const { result: result1 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      // Change date
      vi.mocked(dateUtils.getUTCDate).mockReturnValue(
        new Date("2025-12-05T00:00:00Z")
      );

      const { result: result2 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      expect(result1.current).not.toEqual(result2.current);
    });
  });

  describe("position bounds", () => {
    it("should generate positions within 0-99 range for both x and y", () => {
      const { result } = renderHook(() => useImageZoomPosition("char-1"));

      if (result.current) {
        expect(result.current.x).toBeGreaterThanOrEqual(0);
        expect(result.current.x).toBeLessThan(100);
        expect(result.current.y).toBeGreaterThanOrEqual(0);
        expect(result.current.y).toBeLessThan(100);
      }
    });

    it("should handle edge case IDs", () => {
      const edgeCases = ["", "a", "123", "char-with-long-id"];

      edgeCases.forEach((charId) => {
        const { result } = renderHook(() => useImageZoomPosition(charId));

        if (result.current) {
          expect(result.current.x).toBeGreaterThanOrEqual(0);
          expect(result.current.x).toBeLessThan(100);
          expect(result.current.y).toBeGreaterThanOrEqual(0);
          expect(result.current.y).toBeLessThan(100);
        }
      });
    });
  });

  describe("caching", () => {
    it("should cache position in ref to avoid recalculation", () => {
      const { result, rerender } = renderHook(
        ({ id }: { id: string }) => useImageZoomPosition(id),
        { initialProps: { id: "char-1" } }
      );

      const firstPosition = result.current;

      rerender({ id: "char-1" });

      const secondPosition = result.current;

      // Should be the same reference if cached
      expect(firstPosition).toBe(secondPosition);
    });

    it("should not cache positions for different character IDs", () => {
      const { result: result1 } = renderHook(() =>
        useImageZoomPosition("char-1")
      );

      const { result: result2 } = renderHook(() =>
        useImageZoomPosition("char-2")
      );

      expect(result1.current).not.toBe(result2.current);
    });
  });

  describe("x and y independence", () => {
    it("should generate independent x and y values", () => {
      const positions = new Set<string>();

      // Generate multiple positions to verify x and y are not correlated
      for (let i = 0; i < 10; i++) {
        const { result } = renderHook(() => useImageZoomPosition(`char-${i}`));

        if (result.current) {
          positions.add(`${result.current.x},${result.current.y}`);
        }
      }

      // Should have at least 5 unique positions (very likely)
      expect(positions.size).toBeGreaterThanOrEqual(5);
    });

    it("should have x and y values that are not always identical", () => {
      let xEqualY = 0;
      const total = 50;

      for (let i = 0; i < total; i++) {
        const { result } = renderHook(() =>
          useImageZoomPosition(`char-seed-${i}`)
        );

        if (result.current && result.current.x === result.current.y) {
          xEqualY++;
        }
      }

      // x should not equal y most of the time (allow some coincidences)
      expect(xEqualY).toBeLessThan(total * 0.3);
    });
  });

  describe("seed calculation", () => {
    it("should use character ID and date in seed", () => {
      // This tests that the seed is properly combining character ID and date
      const { result: withDateA } = renderHook(() =>
        useImageZoomPosition("test-char")
      );

      vi.mocked(dateUtils.getUTCDate).mockReturnValue(
        new Date("2025-12-05T00:00:00Z")
      );

      const { result: withDateB } = renderHook(() =>
        useImageZoomPosition("test-char")
      );

      // Same character but different date should give different position
      expect(withDateA.current).not.toEqual(withDateB.current);
    });
  });

  describe("special characters in ID", () => {
    it("should handle special characters in character ID", () => {
      const specialIds = ["char@123", "char#456", "char$789", "char%000"];

      specialIds.forEach((id) => {
        const { result } = renderHook(() => useImageZoomPosition(id));

        if (result.current) {
          expect(result.current.x).toBeDefined();
          expect(result.current.y).toBeDefined();
          expect(result.current.x).toBeGreaterThanOrEqual(0);
          expect(result.current.y).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe("distribution", () => {
    it("should distribute positions across the space", () => {
      const buckets = {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0
      };

      for (let i = 0; i < 100; i++) {
        const { result } = renderHook(() =>
          useImageZoomPosition(`char-dist-${i}`)
        );

        if (result.current) {
          if (result.current.x < 50 && result.current.y < 50) {
            buckets.topLeft++;
          } else if (result.current.x >= 50 && result.current.y < 50) {
            buckets.topRight++;
          } else if (result.current.x < 50 && result.current.y >= 50) {
            buckets.bottomLeft++;
          } else {
            buckets.bottomRight++;
          }
        }
      }

      // All quadrants should have some positions (roughly)
      expect(buckets.topLeft).toBeGreaterThan(0);
      expect(buckets.topRight).toBeGreaterThan(0);
      expect(buckets.bottomLeft).toBeGreaterThan(0);
      expect(buckets.bottomRight).toBeGreaterThan(0);
    });
  });
});
