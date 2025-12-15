export const APPOINTMENT_STATUS = {
  arrived: 'arrived',
  booked: 'booked',
  cancelled: 'cancelled',
  fulfilled: 'fulfilled',
  noshow: 'noshow',
  pending: 'pending',
  proposed: 'proposed',
};

export const DEFAULT_WEEK_DAYS = [
  {
    name: 'Monday',
    abbr: 'Mon',
  },
  {
    name: 'Tuesday',
    abbr: 'Tue',
  },
  {
    name: 'Wednesday',
    abbr: 'Wed',
  },
  {
    name: 'Thursday',
    abbr: 'Thu',
  },
  {
    name: 'Friday',
    abbr: 'Fri',
  },
];

export const DATE_FORMATS = {
  // Friendly formats for displaying dates to users
  // e.g. January 1, 2023
  friendlyDate: 'MMMM d, yyyy',
  // e.g. Monday, January 1, 2023
  friendlyWeekdayDate: 'EEEE, MMMM d, yyyy',
  // ISO 8601
  // e.g. 2025-05-06T21:00:00
  ISODateTime: "yyyy-MM-dd'T'HH:mm:ss",
  // e.g. 2025-05-06T21:00:00Z
  ISODateTimeUTC: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  // e.g. 2025-05-06T21:00:00-05:00"
  ISODateTimeLocal: "yyyy-MM-dd'T'HH:mm:ssXXX",
  // iCalendar RFC 5545
  // e.g. 20250506T225403
  iCalDateTime: "yyyyMMdd'T'HHmmss",
  // e.g. 20250506T225403Z
  iCalDateTimeUTC: "yyyyMMdd'T'HHmmssXXX",
  // Internal formats for use in source code
  // e.g. 2025-05
  yearMonth: 'yyyy-MM',
  // e.g. 2025-05-21
  yearMonthDay: 'yyyy-MM-dd',
};
