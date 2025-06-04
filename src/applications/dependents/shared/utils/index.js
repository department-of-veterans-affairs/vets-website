export const getFullName = ({ first, middle, last } = {}) =>
  [first || '', middle || '', last || ''].filter(Boolean).join(' ');
