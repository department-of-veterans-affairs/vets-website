/**
 * Convert a prescription resource from the API response into the expected format
 * @param {Object} prescription - The prescription data from API
 * @returns {Object} - Formatted prescription object
 */
export const convertPrescription = prescription => {
  // Handle the case where prescription might be null/undefined
  if (!prescription) return null;

  // Extract from attributes if available, otherwise use the prescription object directly
  return prescription.attributes || prescription;
};
