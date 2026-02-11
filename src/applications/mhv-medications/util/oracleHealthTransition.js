/**
 * Oracle Health EHR Transition Utilities for Medications
 */

/**
 * Validate migrations array
 * @param {Array} migrations - Migration data array
 * @returns {boolean} True if valid
 */
const isValidMigrations = migrations =>
  Array.isArray(migrations) && migrations.length > 0;

/**
 * Find migration for a facility
 * @param {string} facilityId - Facility/station ID
 * @param {Array} migrations - Migration data array
 * @returns {Object|null} Migration object or null
 */
const findMigrationByFacility = (facilityId, migrations) =>
  migrations.find(m =>
    m.facilities?.some(f => String(f.facilityId) === String(facilityId)),
  );

/**
 * Check if a facility is transitioning to Oracle Health
 * @param {string} facilityId - Facility/station ID
 * @param {Array} migrations - Migration data from backend
 * @returns {boolean}
 */
export const isFacilityTransitioning = (facilityId, migrations) => {
  if (!facilityId || !isValidMigrations(migrations)) return false;
  return !!findMigrationByFacility(facilityId, migrations);
};

/**
 * Check if refills should be blocked for a prescription
 * @param {Object} prescription - Prescription object
 * @param {boolean} isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} migrations - Migration data from backend
 * @returns {boolean}
 */
export const shouldBlockRefills = (
  prescription,
  isFeatureFlagEnabled,
  migrations,
) => {
  if (
    !prescription?.stationNumber ||
    !isFeatureFlagEnabled ||
    !isValidMigrations(migrations)
  ) {
    return false;
  }

  const migration = findMigrationByFacility(
    prescription.stationNumber,
    migrations,
  );
  if (!migration) return false;

  // Block refills during p4 and p5 phases (full block)
  return ['p4', 'p5'].includes(migration.phases?.current);
};

/**
 * Check if renewals should be blocked for a prescription
 * @param {Object} prescription - Prescription object
 * @param {boolean} isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} migrations - Migration data from backend
 * @returns {boolean}
 */
export const shouldBlockRenewals = (
  prescription,
  isFeatureFlagEnabled,
  migrations,
) => {
  if (
    !prescription?.stationNumber ||
    !isFeatureFlagEnabled ||
    !isValidMigrations(migrations)
  ) {
    return false;
  }

  const migration = findMigrationByFacility(
    prescription.stationNumber,
    migrations,
  );
  if (!migration) return false;

  // Block renewals during p3, p4, and p5 phases (renewal block + full block)
  return ['p3', 'p4', 'p5'].includes(migration.phases?.current);
};

/**
 * Filter prescriptions into available and blocked based on transition phase
 * @param {Array} prescriptions - Array of prescription objects
 * @param {boolean} isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} migrations - Migration data from backend
 * @returns {Object} Object with available and blocked arrays
 */
export const filterPrescriptionsByTransition = (
  prescriptions,
  isFeatureFlagEnabled,
  migrations,
) => {
  try {
    if (!prescriptions || !Array.isArray(prescriptions)) {
      return { available: [], blocked: [] };
    }

    if (!isFeatureFlagEnabled || !migrations || migrations.length === 0) {
      return { available: prescriptions, blocked: [] };
    }

    return prescriptions.reduce(
      (acc, prescription) => {
        const shouldBlock = shouldBlockRefills(
          prescription,
          isFeatureFlagEnabled,
          migrations,
        );
        acc[shouldBlock ? 'blocked' : 'available'].push(prescription);
        return acc;
      },
      { available: [], blocked: [] },
    );
  } catch (error) {
    // On error, fail safe by returning all prescriptions as available
    // This prevents blocking legitimate refills due to filtering errors
    return { available: prescriptions || [], blocked: [] };
  }
};
