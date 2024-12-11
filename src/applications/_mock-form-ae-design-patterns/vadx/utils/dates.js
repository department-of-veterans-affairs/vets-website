import { format, parseISO } from 'date-fns';

export const formatDate = dateString => {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm:ss:aaaaa');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing date:', error);
    return dateString; // Return original string if parsing fails
  }
};
