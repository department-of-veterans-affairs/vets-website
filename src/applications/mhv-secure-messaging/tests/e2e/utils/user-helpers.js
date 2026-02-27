/**
 * Shared helper utilities for creating mock users with various
 * OH (Oracle Health) migration configurations in e2e tests.
 */

/**
 * Creates a mock user object with specific OH migration info merged into the
 * vaProfile. This is useful for testing Cerner/OH transition scenarios such as
 * facility alerts, migration-phase banners, and pretransitioned states.
 *
 * @param {Object} mockUser - The base mock user fixture to extend.
 * @param {Object} ohMigrationInfo - Migration info to set on the user's vaProfile.
 * @param {boolean} ohMigrationInfo.userAtPretransitionedOhFacility - Whether the user
 *   is at a pretransitioned OH facility.
 * @param {boolean} ohMigrationInfo.userFacilityMigratingToOh - Whether the user's
 *   facility is currently migrating to OH.
 * @param {boolean} ohMigrationInfo.userFacilityReadyForInfoAlert - Whether the user's
 *   facility is ready for the info alert.
 * @param {Array} ohMigrationInfo.migrationSchedules - Array of migration schedule objects.
 * @param {Array|null} [facilities=null] - Additional facilities to append to the user's
 *   facility list. Each entry should be an object with `facilityId` and `isCerner`.
 * @param {string} [targetFacilityId='979'] - The facility ID to ensure exists and update.
 * @returns {Object} A new mock user object with the migration info applied.
 *
 * @example
 * import mockUser from '../fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
 * import { createUserWithMigrationInfo } from '../utils/user-helpers';
 *
 * const testUser = createUserWithMigrationInfo(mockUser, {
 *   userAtPretransitionedOhFacility: false,
 *   userFacilityMigratingToOh: true,
 *   userFacilityReadyForInfoAlert: false,
 *   migrationSchedules: [{ facilities: [...], phases: {...} }],
 * }, [{ facilityId: '442', isCerner: false }]);
 */
export const createUserWithMigrationInfo = (
  mockUser,
  ohMigrationInfo,
  facilities = null,
  targetFacilityId = '979',
) => {
  // Get existing facilities from mock user
  const existingFacilities =
    mockUser.data.attributes.vaProfile?.facilities || [];

  // Ensure the target facility exists and update it if needed
  let updatedFacilities = [...existingFacilities];
  const targetIndex = updatedFacilities.findIndex(
    f => f.facilityId === targetFacilityId,
  );

  // For pretransitioned facilities, isCerner should be true
  // For migrating facilities, isCerner should be false
  const isCernerFacility =
    ohMigrationInfo.userAtPretransitionedOhFacility === true;

  if (targetIndex === -1) {
    // Add target facility if it doesn't exist
    updatedFacilities.push({
      facilityId: targetFacilityId,
      isCerner: isCernerFacility,
    });
  } else {
    // Update existing target facility
    updatedFacilities[targetIndex] = {
      ...updatedFacilities[targetIndex],
      facilityId: targetFacilityId,
      isCerner: isCernerFacility,
    };
  }

  // Add any additional facilities if provided
  if (facilities) {
    updatedFacilities = [...updatedFacilities, ...facilities];
  }

  return {
    ...mockUser,
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        vaProfile: {
          ...mockUser.data.attributes.vaProfile,
          facilities: updatedFacilities,
          isCernerPatient: true,
          // Keep flags ONLY in ohMigrationInfo - reducer will map them to root level
          ohMigrationInfo: {
            userAtPretransitionedOhFacility:
              ohMigrationInfo.userAtPretransitionedOhFacility,
            userFacilityMigratingToOh:
              ohMigrationInfo.userFacilityMigratingToOh,
            userFacilityReadyForInfoAlert:
              ohMigrationInfo.userFacilityReadyForInfoAlert,
            migrationSchedules: ohMigrationInfo.migrationSchedules,
          },
        },
      },
    },
  };
};

/**
 * Custom recipients mock with a transitioning (979) and non-transitioning (442) facility.
 * Useful for testing Cerner/OH migration alerts on the care-team selection page.
 */
export const customRecipients = {
  data: [
    {
      id: '1',
      type: 'all_triage_teams',
      attributes: {
        triageTeamId: 1,
        name: 'Test Care Team 979',
        stationNumber: '979',
        blockedStatus: false,
        relationType: 'PATIENT',
        preferredTeam: true,
        ohTriageGroup: false,
        migratingToOh: true,
      },
    },
    {
      id: '2',
      type: 'all_triage_teams',
      attributes: {
        triageTeamId: 2,
        name: 'Test Care Team 442',
        stationNumber: '442',
        blockedStatus: false,
        relationType: 'PATIENT',
        preferredTeam: false,
        ohTriageGroup: false,
      },
    },
  ],
  meta: {
    associatedTriageGroups: 2,
    associatedBlockedTriageGroups: 0,
  },
};
