const stagingStations = ['984', '983'];
const prodStations = ['659', '657'];

/**
 * Determines if a patient is in the Community Care (CC) pilot program user station.
 *
 * @param {boolean} featureCCDirectScheduling - Flag indicating if the CC direct scheduling feature is enabled.
 * @param {Array<{ facilityId: string }>} patientFacilities - Array of patient facilities with their IDs.
 * @returns {boolean} - Returns true if the patient is in the CC pilot program user station, otherwise false.
 */
const getIsInPilotUserStations = (
  featureCCDirectScheduling,
  patientFacilities = [],
) => {
  const pilotStations = [...stagingStations, ...prodStations];
  // eslint-disable-next-line no-unused-vars
  const hasPilotStation = patientFacilities.some(station =>
    pilotStations.includes(station.facilityId),
  );

  return featureCCDirectScheduling && hasPilotStation;
};

const getIsInPilotReferralStation = referral => {
  const validStationIds = [
    ...stagingStations,
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
  return validStationIds.includes(referral.stationId);
};

export { getIsInPilotUserStations, getIsInPilotReferralStation };
