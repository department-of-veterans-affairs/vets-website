import {
  format,
  getMonth,
  getYear,
  getQuarter,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfQuarter,
  startOfYear,
  subQuarters,
  subMonths,
  subYears,
} from 'date-fns';

export const months = [
  { label: 'Jan', value: 1, text: 'January' },
  { label: 'Feb', value: 2, text: 'February' },
  { label: 'Mar', value: 3, text: 'March' },
  { label: 'Apr', value: 4, text: 'April' },
  { label: 'May', value: 5, text: 'May' },
  { label: 'Jun', value: 6, text: 'June' },
  { label: 'Jul', value: 7, text: 'July' },
  { label: 'Aug', value: 8, text: 'August' },
  { label: 'Sep', value: 9, text: 'September' },
  { label: 'Oct', value: 10, text: 'October' },
  { label: 'Nov', value: 11, text: 'November' },
  { label: 'Dec', value: 12, text: 'December' },
];

export function formatDateTime(datetimeString) {
  const dateTime = new Date(datetimeString);
  const formattedDate = format(dateTime, 'eeee, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return [formattedDate, formattedTime];
}

/**
 * Returns an array of the following date range filters:
 *  - The past 3 months from today's date
 *  - The previous full quarters (e.g. if today falls in Q2 2024,
 *  return Q1 2024, Q4 2023, and Q3 2023 )
 *  - All of the current year to date
 *  - All of the previous year
 */
export function getDateFilters() {
  const today = new Date();
  let quarter = getQuarter(today);

  const dateRanges = [];

  dateRanges.push({
    label: 'Past 3 Months',
    start: subMonths(today, 3),
    end: today,
  });

  // Calculate the last 3 complete quarters
  for (let i = 1; i < 4; i++) {
    quarter -= 1;
    if (quarter < 1) {
      quarter = 4;
    }

    const quarterStart = startOfQuarter(subQuarters(today, i));
    const quarterEnd = endOfQuarter(quarterStart);
    const quarterYear = getYear(quarterStart);

    const startMonth = months.find(
      month => month.value === getMonth(quarterStart) + 1,
    );
    const endMonth = months.find(
      month => month.value === getMonth(quarterEnd) + 1,
    );

    dateRanges.push({
      label: `${startMonth.label} ${quarterYear} - ${
        endMonth.label
      } ${quarterYear}`,
      start: new Date(quarterYear, startMonth.value - 1, 1),
      end: endOfMonth(new Date(quarterYear, endMonth.value - 1)),
    });
  }

  // Calculate the last 2 years
  for (let i = 0; i < 2; i++) {
    const previousYear = subYears(today, i);
    dateRanges.push({
      label: `All of ${getYear(previousYear)}`,
      start: startOfYear(previousYear),
      end: endOfYear(previousYear),
    });
  }

  return dateRanges;
}
