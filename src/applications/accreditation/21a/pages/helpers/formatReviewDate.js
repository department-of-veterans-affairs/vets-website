const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats a date string into a more readable format.
 *
 * @param {string} dateString - The date string in 'YYYY-MM-DD', 'YYYYMMDD', or 'YYYY-MM' format.
 * @param {boolean} monthYear - If true, returns the format 'Month Year'. Otherwise, returns 'Month Day, Year'.
 * @returns {string|undefined} - The formatted date string or undefined if the input is invalid.
 *
 * @example
 * formatReviewDate('1990-01-01'); // "January 1, 1990"
 * formatReviewDate('19900101'); // "January 1, 1990"
 * formatReviewDate('1990-01'); // "January 1990"
 * formatReviewDate('1990-01', true); // "January 1990"
 */
export const formatReviewDate = (dateString, monthYear = false) => {
  if (dateString) {
    let [year, month, day] = dateString.split('-', 3);
    // dates (e.g. dob) are sometimes in this pattern: 'YYYYMMDD'
    if (year.length > 4) {
      year = dateString.substring(0, 4);
      month = dateString.substring(4, 6);
      day = dateString.substring(6, 8);
    }

    const formattedMonth = monthNames[Number(month) - 1];

    return monthYear || !day
      ? `${formattedMonth} ${year}`
      : `${formattedMonth} ${day}, ${year}`;
  }

  return undefined;
};
