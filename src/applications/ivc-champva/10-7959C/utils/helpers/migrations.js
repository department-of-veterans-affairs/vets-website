/**
 * Returns file upload data for first item with matching attachmentId
 *
 * @param {Array} data - Array of file upload objects
 * @param {string} id - String to match when checking the attachmentId property
 * (e.g., 'Front of insurance card')
 * @returns {Array|undefined} Array with first matching file upload object where the
 * `attachmentId` property includes `id`, or undefined if no match found
 */
const getAttachment = (data, id) => {
  const res = data?.find(a => a.attachmentId?.includes(id));
  return res ? [res] : undefined;
};

/**
 * Gets file upload data for back of document attachment
 *
 * @param {Array} data - Array of file upload objects
 * @returns {Array|undefined} Array with first file upload object where attachmentId includes 'Back of'
 */
export const getBack = data => getAttachment(data, 'Back of');

/**
 * Gets file upload data for front of document attachment
 *
 * @param {Array} data - Array of file upload objects
 * @returns {Array|undefined} Array with first file upload object where attachmentId includes 'Front of'
 */
export const getFront = data => getAttachment(data, 'Front of');

/**
 * Deletes any properties from the passed-in object that have a value of
 * undefined.
 *
 * @param {Object} obj - Object from which to remove undefined properties
 * @returns {Object} Copy of obj with undefined properties removed
 */
export const removeEmptyKeys = obj => {
  const cleanObject = { ...obj };
  const keysToRemove = [];
  Object.keys(cleanObject).forEach(key => {
    if (cleanObject[key] === undefined) {
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach(key => delete cleanObject[key]);
  return cleanObject;
};
