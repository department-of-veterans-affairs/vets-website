import { parse, addDays, format, isValid } from 'date-fns';

export const endDate = (date, days) => {
  if (!date) {
    return 'a future date (date not available)';
  }
  const formatString = 'MM/dd/yyyy';
  const dateObj = parse(date, formatString, new Date());
  if (!isValid(dateObj)) {
    return 'a future date (date not available)';
  }
  const newDate = addDays(dateObj, days);
  return format(newDate, 'MMMM d, yyyy');
};
