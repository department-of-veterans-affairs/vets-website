import moment from 'moment';

const oneDayInMS = 24 * 60 * 60 * 1000;
const oneWeekInMS = oneDayInMS * 7;
const oneYearInMS = oneDayInMS * 365;

export function oneWeekAgo() {
  return Date.now() - oneWeekInMS;
}

export function oneDayAgo() {
  return Date.now() - oneDayInMS;
}

export function oneDayFromNow() {
  return Date.now() + oneDayInMS;
}

export function oneWeekFromNow() {
  return Date.now() + oneWeekInMS;
}

export function oneYearFromNow() {
  return Date.now() + oneYearInMS;
}

// returns a date string in the format: '1999-01-31'
export function daysAgo(days) {
  const now = Date.now();
  return moment(now - oneDayInMS * days).format('YYYY-MM-DD');
}
