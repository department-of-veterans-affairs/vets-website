/**
 * Oracle Health EHR Transition Utilities for Medications
 */

const isFormattedDate = dateStr =>
  dateStr.includes(',') || /[A-Za-z]/.test(dateStr);

/**
 * Format a phase date for display
 * @param {string} phaseDate - ISO date string or pre-formatted date from backend
 * @param {string} fallbackDate - Fallback date if phaseDate is null/undefined
 * @returns {string} Formatted date string
 */
export const formatPhaseDate = (phaseDate, fallbackDate) => {
  if (!phaseDate) return fallbackDate;
  if (isFormattedDate(phaseDate)) return phaseDate;

  try {
    return new Date(phaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch (error) {
    return fallbackDate;
  }
};

export const MEDICATION_PHASES = {
  PRE_ALERT: 'pre_alert',
  ALERT_ONLY: 'alert_only',
  RENEWAL_BLOCK: 'renewal_block',
  FULL_BLOCK: 'full_block',
  POST_TRANSITION: 'post_transition',
};

/**
 * Map backend phase codes to local phase names
 * @param {string} backendPhase - Phase code from backend (p0-p7)
 * @returns {string} Local phase name
 */
const mapBackendPhaseToLocal = backendPhase => {
  const phaseMap = {
    p0: MEDICATION_PHASES.PRE_ALERT,
    p1: MEDICATION_PHASES.ALERT_ONLY,
    p2: MEDICATION_PHASES.ALERT_ONLY,
    p3: MEDICATION_PHASES.RENEWAL_BLOCK,
    p4: MEDICATION_PHASES.FULL_BLOCK,
    p5: MEDICATION_PHASES.FULL_BLOCK,
    p6: MEDICATION_PHASES.POST_TRANSITION,
    p7: MEDICATION_PHASES.POST_TRANSITION,
  };
  return phaseMap[backendPhase] || MEDICATION_PHASES.PRE_ALERT;
};

/**
 * Get current transition phase from backend migration data
 * @param {Object} migrationData - Migration data from backend
 * @returns {string} Current phase name
 */
export const getCurrentTransitionPhase = migrationData => {
  if (!migrationData || typeof migrationData !== 'object') {
    return MEDICATION_PHASES.PRE_ALERT;
  }

  // Backend must provide current phase
  if (migrationData.phases?.current) {
    return mapBackendPhaseToLocal(migrationData.phases.current);
  }

  // Missing current phase - fail safe to pre-alert (no blocking)
  return MEDICATION_PHASES.PRE_ALERT;
};

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

  const phase = getCurrentTransitionPhase(migration);
  return phase === MEDICATION_PHASES.FULL_BLOCK;
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

  const phase = getCurrentTransitionPhase(migration);
  return [
    MEDICATION_PHASES.RENEWAL_BLOCK,
    MEDICATION_PHASES.FULL_BLOCK,
  ].includes(phase);
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
    console.error('Error filtering prescriptions by transition:', error);
    return { available: prescriptions || [], blocked: [] };
  }
};
