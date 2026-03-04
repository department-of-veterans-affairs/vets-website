import { parse, addDays, format, isValid } from 'date-fns';

export const endDate = (date, diaryCode) => {
  const formatString = 'MM/dd/yyyy';
  const daysToAdd = diaryCode === '815' ? 30 : 60;
  const fallbackMessage = `${daysToAdd} days from when you received this notice`;

  if (!date) {
    return `${fallbackMessage}`;
  }

  const dateObj = parse(date, formatString, new Date());
  if (!isValid(dateObj)) {
    return `${fallbackMessage}`;
  }

  const newDate = addDays(dateObj, daysToAdd);
  return format(newDate, 'MMMM d, yyyy');
};
