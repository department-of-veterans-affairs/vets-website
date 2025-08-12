/**
 * Determine if a prescription is a non-VA prescription
 * @param {Object} rx - The prescription object.
 * @returns {Boolean}
 * - Returns true if the prescription source is 'NV' (Non-VA), indicating it's a non-VA prescription.
 * - Returns false otherwise.
 */
export const rxSourceIsNonVA = rx => rx?.prescriptionSource === 'NV';
