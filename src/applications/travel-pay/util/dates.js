import {
  endOfQuarter,
  format,
  formatISO,
  getQuarter,
  getYear,
  startOfQuarter,
  subMonths,
  subQuarters,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';

export function stripTZOffset(datetimeString) {
  // We need the local time with no TZ indicators for the external API
  // There are 19 characters in the string required by the external API
  // i.e. 2024-06-25T08:00:00
  return datetimeString.slice(0, 19);
}

export function formatDateTime(datetimeString, stripUTCIndicator = false) {
  const str = stripUTCIndicator
    ? stripTZOffset(datetimeString)
    : datetimeString;
  const dateTime = new Date(str);
  const formattedDate = format(dateTime, 'eeee, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return [formattedDate, formattedTime];
}

/**
 * Returns an array of the following date range filters:
 *  - The past 3 months from today's date
 *  - The previous 7 full quarters (e.g. if today falls in Q2 2024,
 *  return Q1 2024, Q4 2023, and Q3 2023, etc. through Q3 2022, i.e. 2 years ago)
 */
export function getDateFilters() {
  const today = utcToZonedTime(new Date());
  let quarter = getQuarter(today);

  const dateRanges = [];

  dateRanges.push({
    label: 'Past 3 Months',
    value: 'pastThreeMonths',
    start: stripTZOffset(formatISO(subMonths(today, 3))),
    end: stripTZOffset(formatISO(today)),
  });

  // Calculate the last 7 complete quarters
  // e.g. up to 2 years ago
  for (let i = 1; i < 7; i++) {
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
    const quarterValue = `Q${quarter}_${getYear(quarterStart)}`;

    dateRanges.push({
      label: quarterLabel,
      value: quarterValue,
      start: stripTZOffset(formatISO(quarterStart)),
      end: stripTZOffset(formatISO(quarterEnd)),
    });
  }

  return dateRanges;
}
