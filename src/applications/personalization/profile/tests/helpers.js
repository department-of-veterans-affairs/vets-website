import moment from 'moment';

// returns a date string in the format: '1999-01-31'
export function daysAgo(days) {
  const oneDayInMS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  return moment(now - oneDayInMS * days).format('YYYY-MM-DD');
}
