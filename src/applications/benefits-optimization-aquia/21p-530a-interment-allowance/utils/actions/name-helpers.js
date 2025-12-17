/**
 * Helper function to get veteran's name from form data
 * @param {Object} formData - The form data
 * @param {string} [fallback='the Veteran'] - Default text when name is not available
 * @returns {string} The veteran's name or fallback text
 */
export const getVeteranName = (formData, fallback = 'the Veteran') => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return fallback;
  }
  const { first = '', middle = '', last = '' } =
    formData?.veteranInformation?.fullName || {};

  const fullName = [first.trim(), middle.trim(), last.trim()]
    .filter(Boolean)
    .join(' ');

  return fullName || fallback;
};
