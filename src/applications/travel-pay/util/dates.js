import {
  endOfQuarter,
  endOfYear,
  format,
  getQuarter,
  getYear,
  startOfQuarter,
  startOfYear,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';

export function formatDateTime(datetimeString, stripUTCIndicator = false) {
  const str = stripUTCIndicator
    ? (datetimeString ?? '').split('Z')[0]
    : datetimeString;
  const dateTime = new Date(str);
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
  const today = utcToZonedTime(new Date());
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
    const quarterLabel = `${format(quarterStart, 'MMM yyyy')} - ${format(
      quarterEnd,
      'MMM yyyy',
    )}`;

    dateRanges.push({
      label: quarterLabel,
      start: quarterStart,
      end: quarterEnd,
    });
  }

  // Calculate the last 2 complete years
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
