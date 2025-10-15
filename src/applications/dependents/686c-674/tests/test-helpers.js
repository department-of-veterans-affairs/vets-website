import { sub, format } from 'date-fns';

export const createDoB = (yearsAgo = 0, monthsAgo = 0) =>
  format(sub(new Date(), { years: yearsAgo, months: monthsAgo }), 'yyyy-MM-dd');
