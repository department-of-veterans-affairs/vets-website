/**
 * Create a refill history item for the original fill, using the prescription
 * @param {Object} Prescription object
 * @returns {Object} Object similar to or marching an rxRefillHistory object
 */

/**
 * Get the refill history for a prescription, including the original fill record
 *
 * @param {Object} prescription - The prescription object
 * @returns {Array} - Returns an array of refill history records, including the original fill record
 */
export const getRefillHistory = prescription => {
  if (!prescription) return [];
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  if (prescription?.dispensedDate) {
    refillHistory.push(prescription);
  }
  return refillHistory;
};
