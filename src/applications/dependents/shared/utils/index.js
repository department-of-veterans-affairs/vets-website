export const getFullName = ({ first, middle, last } = {}) =>
  [first || '', middle || '', last || ''].filter(Boolean).join(' ');

export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 ||
      Object.values(obj)?.filter(Boolean)?.length === 0 ||
      false
    : false;
