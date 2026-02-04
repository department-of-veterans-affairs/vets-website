/**
 * Platform Mock Responses
 *
 * Pure mock data and factory functions for common VA.gov API responses.
 *
 * Use these in:
 * - Unit tests (with msw-adapter or any mock setup)
 * - Browser mocks (with MSW setupWorker)
 * - Cypress tests (with cy.intercept)
 * - Mock server (yarn mock-server)
 *
 * @example
 * // ES modules (webpack/browser)
 * import { mockUser, createFeatureTogglesResponse } from 'platform/mocks/responses';
 *
 * // CommonJS (Node/tests)
 * const { mockUser, createFeatureTogglesResponse } = require('platform/mocks/responses');
 */

// ============================================================================
// User / Authentication
// ============================================================================

/**
 * Creates a user response for authenticated users.
 * @param {Object} overrides - Properties to override in the user object
 * @returns {Object} User response in VA.gov format
 */
function createUserResponse(overrides = {}) {
  return {
    data: {
      id: '',
      type: 'users',
      attributes: {
        profile: {
          signIn: { serviceName: 'idme', ssoe: true, transactionid: 'mock-tx' },
          email: 'test@example.com',
          firstName: 'Test',
          middleName: '',
          lastName: 'User',
          birthDate: '1985-01-01',
          gender: 'M',
          zip: '12345',
          multifactor: true,
          verified: true,
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
          loa: { current: 3 },
          ...overrides.profile,
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
          servedInMilitary: true,
          ...overrides.veteranStatus,
        },
        inProgressForms: overrides.inProgressForms || [],
        prefillsAvailable: overrides.prefillsAvailable || [],
        services: overrides.services || [
          'facilities',
          'hca',
          'edu-benefits',
          'form-save-in-progress',
          'form-prefill',
          'identity-proofed',
          'vet360',
          'appeals-status',
          'user-profile',
        ],
        vaProfile: {
          status: 'OK',
          ...overrides.vaProfile,
        },
        ...overrides,
      },
    },
    meta: { errors: null },
  };
}

/** Default authenticated user response */
const mockUser = createUserResponse();

/** Unauthenticated user error response (401) */
const mockUserUnauthenticated = {
  errors: [
    {
      title: 'Not authorized',
      detail: 'Not authorized',
      code: '401',
      status: '401',
    },
  ],
};

// ============================================================================
// Feature Toggles
// ============================================================================

/**
 * Creates a feature toggles response with the given toggles.
 * @param {Object} toggles - Object with toggle names as keys and boolean values
 * @returns {Object} Feature toggles response in VA.gov format
 *
 * @example
 * createFeatureTogglesResponse({ myFeatureFlag: true, anotherFlag: false })
 */
function createFeatureTogglesResponse(toggles = {}) {
  const features = Object.entries(toggles).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    data: {
      type: 'feature_toggles',
      features,
    },
  };
}

/** Empty feature toggles response (all disabled) */
const mockFeatureToggles = createFeatureTogglesResponse({});

// ============================================================================
// Maintenance Windows
// ============================================================================

/**
 * Creates a maintenance windows response.
 * @param {Array} windows - Array of maintenance window objects
 * @returns {Object} Maintenance windows response in VA.gov format
 */
function createMaintenanceWindowsResponse(windows = []) {
  return { data: windows };
}

/** Empty maintenance windows response (no downtime) */
const mockMaintenanceWindows = createMaintenanceWindowsResponse([]);

// ============================================================================
// VAMC EHR (Facility EHR Systems)
// ============================================================================

/**
 * Creates a VAMC EHR response with custom facilities.
 * @param {Array} facilities - Array of facility objects
 * @returns {Object} VAMC EHR response in CMS format
 *
 * @example
 * createVamcEhrResponse([
 *   { id: 'vha_663', title: 'Seattle VA', system: 'vista' },
 *   { id: 'vha_687', title: 'Walla Walla VA', system: 'cerner' },
 * ])
 */
function createVamcEhrResponse(facilities = []) {
  const entities = facilities.map(f => ({
    title: f.title,
    fieldFacilityLocatorApiId: f.id,
    fieldRegionPage: {
      entity: {
        title: f.regionTitle || f.title,
        fieldVamcEhrSystem: f.system || 'vista',
      },
    },
  }));

  return {
    data: {
      nodeQuery: {
        count: entities.length,
        entities,
      },
    },
  };
}

/** Empty VAMC EHR response */
const mockVamcEhr = createVamcEhrResponse([]);

// ============================================================================
// Exports (CommonJS - works in Node and webpack)
// ============================================================================

module.exports = {
  // User
  createUserResponse,
  mockUser,
  mockUserUnauthenticated,

  // Feature Toggles
  createFeatureTogglesResponse,
  mockFeatureToggles,

  // Maintenance Windows
  createMaintenanceWindowsResponse,
  mockMaintenanceWindows,

  // VAMC EHR
  createVamcEhrResponse,
  mockVamcEhr,
};
