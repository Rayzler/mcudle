import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce Hook", () => {
  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes with default delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    // Update value multiple times quickly
    rerender({ value: "updated1" });
    expect(result.current).toBe("initial"); // Should still be initial

    rerender({ value: "updated2" });
    expect(result.current).toBe("initial"); // Should still be initial

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe("updated2");
    });
  });

  it("should respect custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 100),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    // Wait less than custom delay
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(result.current).toBe("initial");

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("should debounce string values", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "Thor" } }
    );

    rerender({ value: "T" });
    rerender({ value: "Th" });
    rerender({ value: "Tho" });
    rerender({ value: "Thor" });

    await waitFor(() => {
      expect(result.current).toBe("Thor");
    });
  });

  it("should debounce numeric values", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 300),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    await waitFor(() => {
      expect(result.current).toBe(4);
    });
  });

  it("should handle rapid updates without extra debounce", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    // Rapid updates
    for (let i = 1; i <= 10; i++) {
      rerender({ value: `update${i}` });
    }

    // Should settle to the last value after one debounce delay
    await waitFor(() => {
      expect(result.current).toBe("update10");
    });
  });
});
