const months = [
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

export const formatNumericalDate = rawDate => {
  let date;

  if (rawDate) {
    const dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10),
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
};

export const formatReadableMonthYear = rawDate => {
  if (!rawDate) {
    return '';
  }

  const dateParts = rawDate.split('-');
  const date = new Date(
    Number.parseInt(dateParts[0], 10),
    Number.parseInt(dateParts[1], 10) - 1,
    1,
  );

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Given a date in UTC format, determine if the current date is after
 * the final day of the month of the given data.
 *
 * For example, if today is 2022-02-14 and the given date is 2022-01-01,
 * return true.  If today and 2022-02-14 and the given date is
 * 2022-02-01, we would return false.
 *
 * @param {string} date
 */
export const afterLastDayOfMonth = date => {
  const now = new Date().toISOString();

  if (now <= date) {
    return false;
  }

  const nowMonth = now.split('-')[1];
  const dateMonth = date.split('-')[1];

  return nowMonth !== dateMonth;
};
