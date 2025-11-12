import { format, parseISO } from 'date-fns';

export const transformDate = dateStr => {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  return format(date, 'MM/dd/yyyy');
};
