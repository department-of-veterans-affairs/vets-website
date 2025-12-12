/**
 * @module config/form/pages/helpers
 * @description Shared helper functions for form page configurations
 */

/**
 * Helper function to get veteran's name from form data
 * @param {Object} formData - The form data
 * @returns {string} The veteran's name or default text
 */
export const getVeteranName = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'Veteran';
  }

  const veteranInfo = formData.veteranInformation || {};
  const veteranFullName = veteranInfo.veteranFullName || {};
  const hasName = veteranFullName.first || veteranFullName.last;

  if (hasName) {
    const firstName = veteranFullName.first || '';
    const middleName = veteranFullName.middle || '';
    const lastName = veteranFullName.last || '';
    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;
    return fullName.trim();
  }

  return 'Veteran';
};

/**
 * Helper function to get employer's name from form data
 * @param {Object} formData - The form data
 * @returns {string} The employer's name or default text
 */
export const getEmployerName = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'this employer';
  }

  return formData.employerInformation?.employerName || 'this employer';
};

/**
 * Helper function to determine if veteran is currently employed
 * Determines employment status based on presence of ending date
 * @param {Object} formData - The form data
 * @returns {boolean} True if currently employed (no ending date present)
 */
export const isCurrentlyEmployed = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return false;
  }

  // If there's no ending date, assume currently employed
  // If there's an ending date, employment has ended
  return !formData.employmentDates?.endingDate;
};

/**
 * Helper function to get employment tense (present or past)
 * @param {Object} formData - The form data
 * @returns {Object} Object with various tense forms
 */
export const getEmploymentTense = formData => {
  // Defensive: Use isCurrentlyEmployed which has its own validation
  const currently = isCurrentlyEmployed(formData);

  return {
    is: currently ? 'is' : 'was',
    are: currently ? 'are' : 'were',
    does: currently ? 'does' : 'did',
    has: currently ? 'has' : 'had',
  };
};

/**
 * Helper function to get timeframe text for employment
 * @param {Object} formData - The form data
 * @returns {string} The timeframe text
 */
export const getEmploymentTimeframe = formData => {
  // Defensive: Use isCurrentlyEmployed which has its own validation
  const currently = isCurrentlyEmployed(formData);
  return currently
    ? 'last 12 months'
    : '12 months before their last date of employment';
};

/**
 * Helper function to format a date string
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string|null} Formatted date or null if invalid
 */
export const formatDate = dateString => {
  // Defensive: Always check if dateString is valid before processing
  if (!dateString || typeof dateString !== 'string') return null;

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};
