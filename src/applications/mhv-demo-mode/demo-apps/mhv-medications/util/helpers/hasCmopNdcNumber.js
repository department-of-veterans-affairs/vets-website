/**
 * Checks if a prescription has a cmopNdcNumber value directly or in its refill history
 *
 * @param {Array} refillHistory - The refill history array of the prescription
 * @returns {boolean} - Returns true if any refill records have a cmopNdcNumber
 */
export const hasCmopNdcNumber = refillHistory => {
  return refillHistory.some(record => record.cmopNdcNumber);
};
