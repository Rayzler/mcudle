import { describe, it, expect } from "vitest";
import { SearchCharacterSchema } from "@/lib/validation";

describe("SearchCharacterSchema Validation", () => {
  describe("Query validation", () => {
    it("should accept valid search query", () => {
      const result = SearchCharacterSchema.safeParse({ query: "Thor" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("Thor");
      }
    });

    it("should reject empty query", () => {
      const result = SearchCharacterSchema.safeParse({ query: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Search cannot be empty");
      }
    });

    it("should reject query longer than 100 characters", () => {
      const longQuery = "a".repeat(101);
      const result = SearchCharacterSchema.safeParse({ query: longQuery });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Search query too long");
      }
    });

    it("should accept query at maximum length (100 chars)", () => {
      const maxQuery = "a".repeat(100);
      const result = SearchCharacterSchema.safeParse({ query: maxQuery });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe(maxQuery);
      }
    });
  });

  describe("Skip validation", () => {
    it("should accept valid CUID in skip array", () => {
      const result = SearchCharacterSchema.safeParse({
        query: "Thor",
        skip: ["clg0w5g8c0000qz2p8c8c8c8c"]
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.skip).toHaveLength(1);
      }
    });

    it("should accept empty skip array", () => {
      const result = SearchCharacterSchema.safeParse({
        query: "Thor",
        skip: []
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.skip).toEqual([]);
      }
    });

    it("should use default empty array when skip is not provided", () => {
      const result = SearchCharacterSchema.safeParse({ query: "Thor" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.skip).toEqual([]);
      }
    });

    it("should reject invalid CUID format", () => {
      const result = SearchCharacterSchema.safeParse({
        query: "Thor",
        skip: ["invalid-id"]
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Combined validation", () => {
    it("should validate both query and skip together", () => {
      const result = SearchCharacterSchema.safeParse({
        query: "Iron Man",
        skip: ["clg0w5g8c0000qz2p8c8c8c8c", "clg0w5g8c0000qz2p8c8c8c8d"]
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("Iron Man");
        expect(result.data.skip).toHaveLength(2);
      }
    });

    it("should fail if any validation rule fails", () => {
      const result = SearchCharacterSchema.safeParse({
        query: "",
        skip: ["clg0w5g8c0000qz2p8c8c8c8c"]
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Type inference", () => {
    it("should provide correct type after parsing", () => {
      const result = SearchCharacterSchema.parse({
        query: "Captain America",
        skip: []
      });

      // These should compile without errors
      const query: string = result.query;
      const skip: string[] = result.skip;

      expect(query).toBe("Captain America");
      expect(skip).toEqual([]);
    });
  });
});
