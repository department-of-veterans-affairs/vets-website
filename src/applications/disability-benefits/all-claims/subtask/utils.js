import { daysFromToday } from '../tests/utils/dates/dateHelper';
import {
  parseDate,
  parseDateWithTemplate,
  DATE_TEMPLATE,
} from '../utils/dates';

// Helper to get current date as moment object
const getToday = () => parseDate(daysFromToday(0));
export const maxDate = getToday()
  .add(100, 'years')
  .format();

export const getDate = date => parseDateWithTemplate(date);
export const isDateComplete = date => date?.length === DATE_TEMPLATE.length;
export const isDateInFuture = date => date?.diff(getToday()) > 0;
export const isDateLessThanMax = date => date?.isBefore(maxDate);

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
  return dateDischarge.diff(dateToday, 'days');
};
