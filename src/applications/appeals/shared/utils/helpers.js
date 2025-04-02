// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const getItemSchema = (schema, index) => {
  const itemSchema = schema;
  if (itemSchema.items.length > index) {
    return itemSchema.items[index];
  }
  return itemSchema.additionalItems;
};

export const outsidePaths = [
  '/start',
  '/introduction',
  '/confirmation',
  '/form-saved',
  '/error',
  '/resume',
];

const trailingSlashRegex = /\/$/;

/**
 * Check if the form has been started
 * @param {String} pathname - pathname from Router or window location object
 * @returns {Boolean}
 */
export const isOutsideForm = pathname => {
  const currentPath = (pathname || '').replace(trailingSlashRegex, '');
  return outsidePaths.some(path => currentPath.endsWith(path));
};

export const isOnReviewPage = () =>
  window.location.pathname.endsWith('/review-and-submit');
