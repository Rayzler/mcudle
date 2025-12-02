import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing values
 * Delays state updates until the user has stopped changing the value for the specified delay
 *
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * // debouncedSearchTerm only updates 300ms after searchTerm stops changing
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      console.log("debouncedValue:", debouncedValue);
      console.log("Debounced value updated:", value);
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes (cancel previous debounce)
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
