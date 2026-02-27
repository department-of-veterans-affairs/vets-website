/**
 * Oracle Health EHR Transition Utilities for Medications
 */

import { REFILL_BLOCKING_PHASES, RENEWAL_BLOCKING_PHASES } from './constants';

/**
 * Validate migrations array
 * @param {Array} migrations - Migration data array
 * @returns {boolean} True if valid
 */
const isValidMigrations = migrations =>
  Array.isArray(migrations) && migrations.length > 0;

/**
 * Find migration for a facility
 * @param {Object} params - Parameters object
 * @param {string} params.facilityId - Facility/station ID
 * @param {Array} params.migrations - Migration data array
 * @returns {Object|null} Migration object or null
 */
const findMigrationByFacility = ({ facilityId, migrations }) =>
  migrations.find(m =>
    m.facilities?.some(f => String(f.facilityId) === String(facilityId)),
  );

/**
 * Check if a facility is transitioning to Oracle Health
 * @param {Object} params - Parameters object
 * @param {string} params.facilityId - Facility/station ID
 * @param {Array} params.migrations - Migration data from backend
 * @returns {boolean}
 */
export const isFacilityTransitioning = ({ facilityId, migrations }) => {
  if (!facilityId || !isValidMigrations(migrations)) return false;
  return !!findMigrationByFacility({ facilityId, migrations });
};

/**
 * Check if refills should be blocked for a prescription
 * @param {Object} params - Parameters object
 * @param {Object} params.prescription - Prescription object
 * @param {boolean} params.isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} params.migrations - Migration data from backend
 * @param {Array<string>} params.blockingPhases - Phase identifiers that trigger blocking
 * @returns {boolean}
 */
const shouldBlockForPhases = ({
  prescription,
  isFeatureFlagEnabled,
  migrations,
  blockingPhases,
}) => {
  if (
    !prescription?.stationNumber ||
    !isFeatureFlagEnabled ||
    !isValidMigrations(migrations)
  ) {
    return false;
  }

  const migration = findMigrationByFacility({
    facilityId: prescription.stationNumber,
    migrations,
  });
  if (!migration) return false;

  return blockingPhases.includes(migration.phases?.current);
};

/**
 * Check if refills should be blocked for a prescription
 * Blocked during p4 and p5 phases (T-3 through T+2)
 * @param {Object} params - Parameters object
 * @param {Object} params.prescription - Prescription object
 * @param {boolean} params.isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} params.migrations - Migration data from backend
 * @returns {boolean}
 */
export const shouldBlockRefills = ({
  prescription,
  isFeatureFlagEnabled,
  migrations,
}) =>
  shouldBlockForPhases({
    prescription,
    isFeatureFlagEnabled,
    migrations,
    blockingPhases: REFILL_BLOCKING_PHASES,
  });

/**
 * Check if renewals should be blocked for a prescription
 * Blocked during p3, p4, and p5 phases (T-6 through T+2)
 * @param {Object} params - Parameters object
 * @param {Object} params.prescription - Prescription object
 * @param {boolean} params.isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} params.migrations - Migration data from backend
 * @returns {boolean}
 */
export const shouldBlockRenewals = ({
  prescription,
  isFeatureFlagEnabled,
  migrations,
}) =>
  shouldBlockForPhases({
    prescription,
    isFeatureFlagEnabled,
    migrations,
    blockingPhases: RENEWAL_BLOCKING_PHASES,
  });

/**
 * Filter prescriptions into available and blocked based on transition phase
 * @param {Object} params - Parameters object
 * @param {Array} params.prescriptions - Array of prescription objects
 * @param {boolean} params.isFeatureFlagEnabled - Whether feature flag is enabled
 * @param {Array} params.migrations - Migration data from backend
 * @returns {Object} Object with available and blocked arrays
 */
export const filterPrescriptionsByTransition = ({
  prescriptions,
  isFeatureFlagEnabled,
  migrations,
}) => {
  try {
    if (!prescriptions || !Array.isArray(prescriptions)) {
      return { available: [], blocked: [] };
    }

    if (!isFeatureFlagEnabled || !migrations || migrations.length === 0) {
      return { available: prescriptions, blocked: [] };
    }

    return prescriptions.reduce(
      (acc, prescription) => {
        const shouldBlock = shouldBlockRefills({
          prescription,
          isFeatureFlagEnabled,
          migrations,
        });
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
