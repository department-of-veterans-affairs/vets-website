import { format, add, sub } from 'date-fns';

export function oneWeekAgo() {
  return sub(new Date(), { weeks: 1 }).getTime();
}

export function oneDayAgo() {
  return sub(new Date(), { days: 1 }).getTime();
}

export function oneDayFromNow() {
  return add(new Date(), { days: 1 }).getTime();
}

export function oneWeekFromNow() {
  return add(new Date(), { weeks: 1 }).getTime();
}

export function oneYearFromNow() {
  return add(new Date(), { years: 1 }).getTime();
}

// returns a date string in the format: '1999-01-31'
export function daysAgo(days) {
  return format(sub(new Date(), { days }), 'yyyy-MM-dd');
}
