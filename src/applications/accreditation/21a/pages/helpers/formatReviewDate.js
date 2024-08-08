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

export const formatReviewDate = (dateString, monthYear = false) => {
  if (dateString) {
    let [year, month, day] = dateString.split('-', 3);
    // dates (e.g. dob) are sometimes in this pattern: 'YYYYMMDD'
    if (year.length > 4) {
      year = dateString.substring(0, 4);
      month = dateString.substring(4, 6);
      day = dateString.substring(6, 8);
    }

    const formattedMonth = monthNames[parseInt(month, 10) - 1];
    const formattedDay = parseInt(day, 10).toString();

    return monthYear
      ? `${formattedMonth} ${year}`
      : `${formattedMonth} ${formattedDay}, ${year}`;
  }

  return undefined;
};
