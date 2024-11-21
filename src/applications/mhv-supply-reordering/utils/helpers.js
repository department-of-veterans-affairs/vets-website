import { format } from 'date-fns';

const formatDate = dateString => format(new Date(dateString), 'MMMM d, yyyy');

export { formatDate };
