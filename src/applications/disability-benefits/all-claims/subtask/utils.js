import { daysFromToday } from '../tests/utils/dates/dateHelper';
import { parseDate, parseDateWithTemplate } from '../utils/dates';

export const dateTemplate = 'YYYY-MM-DD';

// Helper to get current date as moment object
const getToday = () => parseDate(daysFromToday(0));
export const maxDate = getToday()
  .add(100, 'years')
  .formatDate();

export const getDate = date => parseDateWithTemplate(date);
export const isDateComplete = date => date?.length === dateTemplate.length;
export const isDateInFuture = date => {
  const dateObj = getDate(date);
  const today = getDate(daysFromToday(0));
  return dateObj && dateObj.diff(today) > 0;
};

export const isDateLessThanMax = date => {
  const dateObj = getDate(date);
  return dateObj && dateObj.isBefore(maxDate);
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
  return dateDischarge.diff(dateToday, 'days');
};
