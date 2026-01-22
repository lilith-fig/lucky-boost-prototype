/**
 * Format a number with thousand separators and always show 2 decimal places
 * @param value - The number to format
 * @returns Formatted string (e.g., "5,000.00")
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
