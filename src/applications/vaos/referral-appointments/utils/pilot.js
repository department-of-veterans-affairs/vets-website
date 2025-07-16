/**
 * Determines if a patient is in the Community Care (CC) pilot program.
 *
 * @param {boolean} featureCCDirectScheduling - Flag indicating if the CC direct scheduling feature is enabled.
 * @param {Array<{ facilityId: string }>} patientFacilities - Array of patient facilities with their IDs.
 * @returns {boolean} - Returns true if the patient is in the CC pilot program, otherwise false.
 */
const getIsInCCPilot = (featureCCDirectScheduling, patientFacilities = []) => {
  const stagingStations = ['984', '983'];
  const prodStations = ['659', '657'];
  const pilotStations = [...stagingStations, ...prodStations];
  // eslint-disable-next-line no-unused-vars
  const hasPilotStation = patientFacilities.some(station =>
    pilotStations.includes(station.facilityId),
  );

  return featureCCDirectScheduling && hasPilotStation;
};

const getIsInPilotReferralStation = referral => {
  const VALID_STATION_IDS = [
    '659',
    '659BY',
    '659BZ',
    '659GA',
    '657A5',
    '657GJ',
    '657GK',
    '657GL',
    '657GM',
    '657GO',
    '657GP',
    '657GQ',
    '657GR',
    '657GT',
    '657GU',
    '657QD',
  ];
  return VALID_STATION_IDS.includes(referral.stationId);
};

export { getIsInCCPilot, getIsInPilotReferralStation };
