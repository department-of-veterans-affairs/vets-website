import { isValid } from 'date-fns';
import { formatDateShort } from 'platform/utilities/date';

export const formatDate = dateString => {
  if (!dateString) return 'Not provided';

  try {
    const birthDate = new Date(dateString.replace(/-/g, '/'));
    return isValid(birthDate) ? formatDateShort(birthDate) : 'Not provided';
  } catch (error) {
    return dateString || 'Not provided';
  }
};
