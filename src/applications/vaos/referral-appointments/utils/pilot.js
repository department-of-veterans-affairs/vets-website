/**
 * Determines if a patient is in the Community Care (CC) pilot program.
 *
 * @param {boolean} featureCCDirectScheduling - Flag indicating if the CC direct scheduling feature is enabled.
 * @param {Array<{ facilityId: string }>} patientFacilities - Array of patient facilities with their IDs.
 * @returns {boolean} - Returns true if the patient is in the CC pilot program, otherwise false.
 */
const getIsInCCPilot = (featureCCDirectScheduling, patientFacilities = []) => {
  const pilotStations = ['984', '983'];
  if (!featureCCDirectScheduling) {
    return false;
  }
  return patientFacilities.some(station =>
    pilotStations.includes(station.facilityId),
  );
};

export { getIsInCCPilot };
