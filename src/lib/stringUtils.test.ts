import { describe, it, expect } from "vitest";
import { capitalize, xmur3, mulberry32 } from "./stringUtils";

describe("stringUtils", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should lowercase the rest of the string", () => {
      expect(capitalize("HELLO")).toBe("Hello");
    });

    it("should handle mixed case strings", () => {
      expect(capitalize("hELLO")).toBe("Hello");
    });

    it("should handle single character strings", () => {
      expect(capitalize("a")).toBe("A");
    });

    it("should handle empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle strings with spaces", () => {
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("should handle strings with special characters", () => {
      expect(capitalize("!hello")).toBe("!hello");
    });
  });

  describe("xmur3", () => {
    it("should return a function", () => {
      const hash = xmur3("test");
      expect(typeof hash).toBe("function");
    });

    it("should generate deterministic outputs for the same seed", () => {
      const seed1 = "test-seed";
      const hash1 = xmur3(seed1);
      const hash2 = xmur3(seed1);

      const results1 = [hash1(), hash1(), hash1()];
      const results2 = [hash2(), hash2(), hash2()];

      expect(results1).toEqual(results2);
    });

    it("should generate different outputs for different seeds", () => {
      const hash1 = xmur3("seed1");
      const hash2 = xmur3("seed2");

      const result1 = hash1();
      const result2 = hash2();

      expect(result1).not.toBe(result2);
    });

    it("should generate consistent sequence for same seed", () => {
      const seed = "consistent-seed";
      const hash1 = xmur3(seed);
      const hash2 = xmur3(seed);

      const sequence1 = [hash1(), hash1(), hash1(), hash1(), hash1()];
      const sequence2 = [hash2(), hash2(), hash2(), hash2(), hash2()];

      expect(sequence1).toEqual(sequence2);
    });

    it("should handle empty strings", () => {
      const hash = xmur3("");
      expect(typeof hash()).toBe("number");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      const hash = xmur3(longString);
      expect(typeof hash()).toBe("number");
    });

    it("should produce outputs in valid uint32 range", () => {
      const hash = xmur3("range-test");
      for (let i = 0; i < 100; i++) {
        const value = hash();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(0xffffffff);
      }
    });

    it("should be sensitive to character changes", () => {
      const hash1 = xmur3("abc");
      const hash2 = xmur3("abd");

      expect(hash1()).not.toBe(hash2());
    });

    it("should be sensitive to character order", () => {
      const hash1 = xmur3("abc");
      const hash2 = xmur3("cba");

      expect(hash1()).not.toBe(hash2());
    });
  });

  describe("mulberry32", () => {
    it("should return a function", () => {
      const rng = mulberry32(123);
      expect(typeof rng).toBe("function");
    });

    it("should generate deterministic outputs for the same seed", () => {
      const seed = 12345;
      const rng1 = mulberry32(seed);
      const rng2 = mulberry32(seed);

      const results1 = [rng1(), rng1(), rng1()];
      const results2 = [rng2(), rng2(), rng2()];

      expect(results1).toEqual(results2);
    });

    it("should generate different outputs for different seeds", () => {
      const rng1 = mulberry32(12345);
      const rng2 = mulberry32(54321);

      const result1 = rng1();
      const result2 = rng2();

      expect(result1).not.toBe(result2);
    });

    it("should generate consistent sequence for same seed", () => {
      const seed = 99999;
      const rng1 = mulberry32(seed);
      const rng2 = mulberry32(seed);

      const sequence1 = [rng1(), rng1(), rng1(), rng1(), rng1()];
      const sequence2 = [rng2(), rng2(), rng2(), rng2(), rng2()];

      expect(sequence1).toEqual(sequence2);
    });

    it("should produce outputs in range [0, 1)", () => {
      const rng = mulberry32(42);
      for (let i = 0; i < 1000; i++) {
        const value = rng();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it("should handle zero seed", () => {
      const rng = mulberry32(0);
      expect(typeof rng()).toBe("number");
    });

    it("should handle negative seed", () => {
      const rng = mulberry32(-12345);
      expect(typeof rng()).toBe("number");
    });

    it("should handle large seed values", () => {
      const rng = mulberry32(0xffffffff);
      expect(typeof rng()).toBe("number");
    });

    it("should have good distribution over many iterations", () => {
      const rng = mulberry32(777);
      const buckets = new Array(10).fill(0);

      for (let i = 0; i < 10000; i++) {
        const value = rng();
        const bucket = Math.floor(value * 10);
        buckets[bucket]++;
      }

      // Each bucket should have roughly 1000 items (±30% tolerance)
      const expectedPerBucket = 1000;
      const tolerance = 300;

      buckets.forEach((count) => {
        expect(count).toBeGreaterThan(expectedPerBucket - tolerance);
        expect(count).toBeLessThan(expectedPerBucket + tolerance);
      });
    });
  });

  describe("xmur3 + mulberry32 integration", () => {
    it("should work together for seeding", () => {
      const seed = "game-seed-123";
      const hash = xmur3(seed);
      const seedValue = hash();
      const rng = mulberry32(seedValue);

      const result = rng();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("should produce reproducible sequences using xmur3 as seeder", () => {
      const seed = "daily-challenge-seed";

      const hash1 = xmur3(seed);
      const rng1 = mulberry32(hash1());
      const sequence1 = [rng1(), rng1(), rng1(), rng1(), rng1()];

      const hash2 = xmur3(seed);
      const rng2 = mulberry32(hash2());
      const sequence2 = [rng2(), rng2(), rng2(), rng2(), rng2()];

      expect(sequence1).toEqual(sequence2);
    });

    it("should produce different sequences for different seeds", () => {
      const seed1 = "seed-1";
      const seed2 = "seed-2";

      const hash1 = xmur3(seed1);
      const rng1 = mulberry32(hash1());
      const sequence1 = [rng1(), rng1(), rng1()];

      const hash2 = xmur3(seed2);
      const rng2 = mulberry32(hash2());
      const sequence2 = [rng2(), rng2(), rng2()];

      expect(sequence1).not.toEqual(sequence2);
    });
  });
});
