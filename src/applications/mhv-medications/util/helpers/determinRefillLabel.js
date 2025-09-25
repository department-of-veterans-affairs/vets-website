/**
 * @param {Boolean} isPartialFill is it partial refill
 * @param {Array} rxHistory refill history array
 * @param {Number} refillPosition refill position
 * @param {Number} index index
 * @returns {String}
 */
export const determineRefillLabel = (isPartialFill, rxHistory, i) => {
  if (isPartialFill) {
    return 'Partial fill';
  }
  return i + 1 === rxHistory.length ? 'Original fill' : 'Refill';
};
