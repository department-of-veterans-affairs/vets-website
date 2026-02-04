import { add, differenceInDays, isAfter, isBefore, format } from 'date-fns';
import { getToday } from '../utils/dates/formatting';
import {
  parseDate,
  parseDateWithTemplate,
  DATE_TEMPLATE,
} from '../utils/dates';

// Helper to get current date as Date object
export const maxDate = format(add(getToday(), { years: 100 }), DATE_TEMPLATE);

export const getDate = date => parseDateWithTemplate(date);
export const isDateComplete = date => date?.length === DATE_TEMPLATE.length;
export const isDateInFuture = date => isAfter(date, getToday());
export const isDateLessThanMax = date => {
  const maxDateObj = parseDate(maxDate);
  return isBefore(date, maxDateObj);
};

export const isValidDate = date => {
  if (date && isDateComplete(date)) {
    const dateObj = getDate(date);
    return isDateInFuture(dateObj) && isDateLessThanMax(dateObj);
  }
  return false;
};

export const getDiffInDays = date => {
  const dateDischarge = getDate(date);
  const dateToday = getToday();
  return differenceInDays(dateDischarge, dateToday);
};
