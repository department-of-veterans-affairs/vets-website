/**
 * Centralized test utilities for VASS application unit tests.
 *
 * This module provides shared test helpers to avoid duplicating redux state
 * configuration across multiple test files.
 */
import React from 'react';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import { useLocation } from 'react-router-dom-v5-compat';
import reducers from '../redux/reducers';

import { vassApi } from '../redux/api/vassApi';
import { FLOW_TYPES } from './constants';

/**
 * @typedef {{ topicId: string, topicName: string }} Topic
 */

/**
 * @typedef {Object} VassFormState
 * @property {boolean} hydrated - Whether the form state has been hydrated from storage
 * @property {string | null} selectedDate - The selected appointment date (ISO 8601 string)
 * @property {Topic[]} selectedTopics - Array of selected discussion topics
 * @property {string | null} obfuscatedEmail - Partially hidden email for display
 * @property {string | null} uuid - Unique identifier from the appointment URL
 * @property {string | null} lastname - User's last name for verification
 * @property {string | null} dob - User's date of birth for verification (YYYY-MM-DD)
 * @property {'schedule'|'cancel'|'any'} flowType - The current user flow type
 */

/**
 * Default initial state for vassForm slice.
 * This mirrors the initialState defined in formSlice.js
 * @type {VassFormState}
 */
export const defaultVassFormState = {
  hydrated: false,
  selectedDate: null,
  selectedTopics: [],
  obfuscatedEmail: null,
  uuid: null,
  lastname: null,
  dob: null,
  flowType: FLOW_TYPES.ANY,
};

/**
 * Default initial state for scheduledDowntime slice.
 * Setting isReady: true bypasses the DowntimeNotification loading indicator.
 * serviceMap must be a Map (not null) when isReady is true.
 */
export const defaultScheduledDowntimeState = {
  globalDowntime: null,
  isReady: true,
  isPending: false,
  serviceMap: new Map(),
  dismissedDowntimeWarnings: [],
};

/**
 * Creates default render options for tests using renderWithStoreAndRouterV6.
 *
 * @param {Object} vassFormOverrides - Override values for vassForm state fields
 * @param {Object} additionalState - Additional redux state slices (e.g., vassApi for RTK Query cache)
 * @returns {Object} Render options object with initialState, reducers, and middlewares
 *
 * @example
 * // Basic usage with defaults
 * const options = getDefaultRenderOptions();
 *
 * @example
 * // With vassForm state overrides
 * const options = getDefaultRenderOptions({
 *   hydrated: true,
 *   uuid: 'test-uuid-1234',
 * });
 *
 * @example
 * // Spreading with additional options
 * const options = {
 *   ...getDefaultRenderOptions({ uuid: 'test-uuid-1234' }),
 *   initialEntries: ['/some-path'],
 * };
 *
 * @example
 * // With additional redux state (e.g., pre-populated RTK Query cache)
 * const options = getDefaultRenderOptions({}, { vassApi: vassApiState });
 */
export const getDefaultRenderOptions = (
  vassFormOverrides = {},
  additionalState = {},
) => ({
  initialState: {
    vassForm: {
      ...defaultVassFormState,
      ...vassFormOverrides,
    },
    scheduledDowntime: {
      ...defaultScheduledDowntimeState,
    },
    ...additionalState,
  },
  reducers,
  additionalMiddlewares: [vassApi.middleware],
});

export const getHydratedFormRenderOptions = (vassFormOverrides = {}) => {
  const defaultOptions = getDefaultRenderOptions(vassFormOverrides);
  const initialState = {
    ...defaultOptions.initialState,
    vassForm: {
      hydrated: true,
      selectedDate: '2025-01-01',
      obfuscatedEmail: 's***@example.com',
      selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
      uuid: 'test-uuid',
      lastname: 'Smith',
      dob: '1935-04-07',
      ...vassFormOverrides,
    },
  };

  const store = createStore(
    combineReducers({ ...commonReducer, ...reducers }),
    initialState,
    applyMiddleware(thunk, vassApi.middleware),
  );
  return {
    ...defaultOptions,
    initialState,
    reducers,
    additionalMiddlewares: [vassApi.middleware],
    store,
  };
};

// Helper component to display current location for testing navigation
export const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
    </div>
  );
};

// Simple test component to wrap
export const TestComponent = () => (
  <div data-testid="test-component">Test Content</div>
);
/**
 * Default mock appointment data for tests.
 * Use createMockAppointmentData() to override specific fields.
 */
export const defaultAppointmentData = {
  appointmentId: 'test-appointment-123',
  startUTC: '2025-05-01T16:00:00.000Z',
  endUTC: '2025-05-01T16:30:00.000Z',
  agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
  agentNickname: 'Bill Brasky',
  appointmentStatusCode: 1,
  appointmentStatus: 'Confirmed',
  cohortStartUtc: '2025-01-01T00:00:00.000Z',
  cohortEndUtc: '2025-12-31T23:59:59.999Z',
};

/**
 * Creates mock appointment data with optional overrides.
 *
 * @param {Object} overrides - Fields to override in the default appointment data
 * @returns {Object} Appointment data object
 *
 * @example
 * const appointment = createMockAppointmentData({ appointmentId: 'custom-id' });
 */
export const createMockAppointmentData = (overrides = {}) => ({
  ...defaultAppointmentData,
  ...overrides,
});

/**
 * Creates RTK Query cache state with a pre-populated appointment.
 * Use this to mock the getAppointment query result.
 *
 * @param {string} appointmentId - The appointment ID to use in the cache key
 * @param {Object} appointmentData - The appointment data to cache (use createMockAppointmentData)
 * @returns {Object} RTK Query state object for vassApi
 *
 * @example
 * const vassApiState = createVassApiStateWithAppointment('123', createMockAppointmentData({ appointmentId: '123' }));
 * const options = getDefaultRenderOptions({}, { vassApi: vassApiState });
 */
export const createVassApiStateWithAppointment = (
  appointmentId,
  appointmentData,
) => ({
  queries: {
    [`getAppointment({"appointmentId":"${appointmentId}"})`]: {
      status: 'fulfilled',
      endpointName: 'getAppointment',
      requestId: 'test',
      startedTimeStamp: 0,
      data: appointmentData,
    },
  },
  mutations: {},
  provided: {},
  subscriptions: {},
  config: {
    online: true,
    focused: true,
    middlewareRegistered: true,
  },
});

// Re-export commonly used items for convenience
export { reducers, vassApi };
