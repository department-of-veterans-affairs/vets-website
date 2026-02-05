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
import { defaultFormState, createRootFormState } from './form';

// Re-export for backwards compatibility
export const defaultVassFormState = defaultFormState;

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
      ...defaultFormState,
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

// Re-export for backwards compatibility
export const createVassFormRootState = createRootFormState;

// Re-export commonly used items for convenience
export { reducers, vassApi };
