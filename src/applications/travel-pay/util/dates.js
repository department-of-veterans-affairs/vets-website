import { format } from 'date-fns';

export function formatDateTime(datetimeString) {
  const dateTime = new Date(datetimeString);
  const formattedDate = format(dateTime, 'eeee, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return [formattedDate, formattedTime];
}
