export const EMPTY_VALUE = '—';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const sanitize = value => {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return EMPTY_VALUE;
  }
  return value;
};

export const formatDate = value => {
  if (!value || typeof value !== 'string') {
    return EMPTY_VALUE;
  }
  const parts = value.split('-');
  if (parts.length !== 3) {
    return sanitize(value);
  }
  const [month, day, year] = parts.map(part => parseInt(part, 10));
  if (
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return sanitize(value);
  }
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
};

export const formatIsoDate = value => {
  if (!value || typeof value !== 'string') return EMPTY_VALUE;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31)
    return sanitize(value);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
};

export const maskSsn = value => {
  if (!value || typeof value !== 'string') {
    return EMPTY_VALUE;
  }
  return value.replace(/\d(?=\d{4})/g, '*');
};
