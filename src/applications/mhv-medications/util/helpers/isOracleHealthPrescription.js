/**
 * Determine if a prescription is from an Oracle Health (Cerner) facility
 * @param {Object} rx - The prescription object containing stationNumber
 * @param {Array} cernerFacilityIds - Array of Cerner/Oracle Health facility IDs (vhaIds)
 * @returns {Boolean}
 * - Returns true if the prescription's stationNumber matches a Cerner facility ID
 * - Returns false otherwise
 */
export const isOracleHealthPrescription = (rx, cernerFacilityIds = []) => {
  if (!rx?.stationNumber || !Array.isArray(cernerFacilityIds)) {
    return false;
  }
  return cernerFacilityIds.includes(rx.stationNumber);
};
