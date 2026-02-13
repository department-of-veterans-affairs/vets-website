/**
 * Determine if a prescription is from an Oracle Health (Cerner) facility
 * @param {Object} rx - The prescription object
 * @param {Array} cernerFacilityIds - Array of Cerner/Oracle Health facility IDs (vhaIds)
 * @returns {Boolean}
 * - Returns true if sourceEhr is 'OH', or if stationNumber matches a Cerner facility ID
 * - Returns false otherwise
 */
export const isOracleHealthPrescription = (rx, cernerFacilityIds = []) => {
  if (!rx) return false;

  // Primary: use backend-provided source EHR flag
  if (rx.sourceEhr) {
    return rx.sourceEhr === 'OH';
  }

  // Fallback: match stationNumber against Cerner facility IDs
  if (!rx.stationNumber || !Array.isArray(cernerFacilityIds)) {
    return false;
  }
  return cernerFacilityIds.includes(rx.stationNumber);
};
