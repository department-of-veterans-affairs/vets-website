/**
 * Join an array of strings with commas and an Oxford comma for the last item.
 * Examples:
 * [] -> ''
 * ['A'] -> 'A'
 * ['A', 'B'] -> 'A and B'
 * ['A', 'B', 'C'] -> 'A, B, and C'
 */
export function oxfordCommaList(items = []) {
  if (!Array.isArray(items) || items.length < 2) {
    return items.toString();
  }
  if (items.length === 2) return items.join(' and ');

  const head = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${head}, and ${last}`;
}
