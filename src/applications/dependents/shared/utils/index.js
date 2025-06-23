export const getFullName = ({ first, middle, last } = {}) =>
  [first || '', middle || '', last || ''].filter(Boolean).join(' ');

export function isEmptyObject(obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return (
      Object.keys(obj)?.length === 0 ||
      Object.values(obj)?.filter(
        item =>
          typeof item === 'object' ? !isEmptyObject(item) : Boolean(item),
      )?.length === 0 ||
      false
    );
  }
  return false;
}
