import { formatDateLong } from 'platform/utilities/date';

export const formatDate = isoString => {
  if (!isoString) return '';
  const trimmed = isoString.replace('Z', '');
  return formatDateLong(trimmed);
};
