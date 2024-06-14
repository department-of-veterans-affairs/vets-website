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

/**
 * Return a phone number object
 * @param {String} phone - phone number string to convert to an object
 * @return {phoneObject}
 */
export const returnPhoneObject = phone => {
  const result = {
    countryCode: '',
    areaCode: '',
    phoneNumber: '',
    phoneNumberExt: '',
  };
  if (typeof phone === 'string' && phone?.length === 10) {
    result.countryCode = '1';
    result.areaCode = phone.slice(0, 3);
    result.phoneNumber = phone.slice(-7);
  }
  return result;
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
