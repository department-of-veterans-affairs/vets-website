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
 * @property {{ dtStartUtc: string | null, dtEndUtc: string | null }} selectedSlot - The selected appointment slot
 * @property {Topic[]} selectedTopics - Array of selected discussion topics
 * @property {string | null} obfuscatedEmail - Partially hidden email for display
 * @property {string | null} uuid - Unique identifier from the appointment URL
 * @property {string | null} lastName - User's last name for verification
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
  selectedSlot: {
    dtStartUtc: null,
    dtEndUtc: null,
  },
  selectedTopics: [],
  obfuscatedEmail: null,
  uuid: null,
  lastName: null,
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
      selectedSlot: {
        dtStartUtc: '2025-01-01T10:00:00.000Z',
        dtEndUtc: '2025-01-01T10:30:00.000Z',
      },
      obfuscatedEmail: 's***@example.com',
      selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
      uuid: 'test-uuid',
      lastName: 'Smith',
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
 * Creates root state object for testing selectors.
 * Wraps vassForm state in the expected root state structure.
 *
 * @param {Object} overrides - Override values for vassForm state fields
 * @returns {Object} Root state with vassForm slice
 *
 * @example
 * // Basic usage with defaults
 * const state = createVassFormRootState();
 *
 * @example
 * // With overrides
 * const state = createVassFormRootState({
 *   selectedDate: '2025-01-15T10:00:00.000Z',
 *   hydrated: true,
 * });
 */
export const createVassFormRootState = (overrides = {}) => ({
  vassForm: { ...defaultVassFormState, ...overrides },
});

// Re-export commonly used items for convenience
export { reducers, vassApi };
