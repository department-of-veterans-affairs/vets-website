/**
 * Determines if the applicant has previous names
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant has previous names, false otherwise
 */
export function doesHavePreviousNames(formData) {
  return formData.serveUnderOtherNames === true;
}
