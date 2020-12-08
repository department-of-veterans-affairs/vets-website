/**
 * Transform an object into all `view:` fields to prevent submitting to the API.
 *
 * @param {object} formData - The object to "viewify"
 * @returns {object} - An object where all the fields are prefixed with `view:` if
 *          they aren't already
 */
export default function viewifyFields(formData) {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const viewKey = /^view:/.test(key) ? key : `view:${key}`;
    // Recurse if necessary
    newFormData[viewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? viewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
}
