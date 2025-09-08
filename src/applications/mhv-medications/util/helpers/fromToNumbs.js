/**
 * Create pagination numbers
 * @param {Number} currentPage
 * @param {Number} totalPages
 * @param {Number} list
 * @param {Number} maxPerPage
 * @returns {Array} Array of numbers
 */
export const fromToNumbs = (page, total, listLength, maxPerPage) => {
  if (listLength < 1) {
    return [0, 0];
  }
  const from = (page - 1) * maxPerPage + 1;
  const to = Math.min(page * maxPerPage, total);
  return [from, to];
};
