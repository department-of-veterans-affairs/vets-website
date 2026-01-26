/**
 * Centralized test utilities for VASS application unit tests.
 *
 * This module provides shared test helpers to avoid duplicating redux state
 * configuration across multiple test files.
 */
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import reducers from '../redux/reducers';

import { vassApi } from '../redux/api/vassApi';

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

// Re-export commonly used items for convenience
export { reducers, vassApi };
