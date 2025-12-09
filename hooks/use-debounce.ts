import { useEffect, useState } from "react";

/**
 * useDebounce
 *
 * Returns a debounced value that only updates after the specified delay.
 * Useful for delaying expensive operations (API calls, etc.) until the user stops typing.
 *
 * @param value The value to debounce
 * @param delay The debounce delay in ms (default: 500)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
