/**
 * Get show refill history
 *
 * @param {Array} refillHistory - refill history array
 * @returns {Boolean}
 */
export const getShowRefillHistory = refillHistory => {
  return (
    refillHistory?.length > 1 || refillHistory?.[0]?.dispensedDate !== undefined
  );
};
