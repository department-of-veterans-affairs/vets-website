export default function(items) {
  const uniques = new Set(items);
  return Array.from(uniques);
}
