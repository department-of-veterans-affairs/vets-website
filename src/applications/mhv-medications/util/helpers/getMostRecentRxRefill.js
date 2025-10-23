/**
 * Get the most recent prior prescription for a medication, based solely on sortedDispensedDate.
 *
 * @param {Rx} rx
 *   The medication aggregate containing `groupedMedications`.
 * @returns {GroupedMedication|string}
 *   The newest `GroupedMedication` object, or `''` when none exist.
 */
export const getMostRecentRxRefill = rx => {
  const list = rx?.groupedMedications ?? [];
  if (!list.length) return '';

  return [...list].sort(
    (a, b) => new Date(b.sortedDispensedDate) - new Date(a.sortedDispensedDate),
  )[0];
};
