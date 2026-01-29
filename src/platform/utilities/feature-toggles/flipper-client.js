/* This file is must run in both NodeJS and browser environments */

import { getFlipperId } from './helpers';
import { apiRequest } from '../api';

const FLIPPER_ID = getFlipperId();
const TOGGLE_VALUES_PATH = `/v0/feature_toggles?cookie_id=${FLIPPER_ID}`;
const TOGGLE_POLLING_INTERVAL = 5000;

let flipperClientInstance;

function FlipperClient({ toggleValuesPath = TOGGLE_VALUES_PATH } = {}) {
  let _timeoutId;
  let _pollingActive;
  let _authFailureDetected = false;
  const _subscriberCallbacks = [];

  // Define stopPollingToggleValues FIRST (before it's used)
  const stopPollingToggleValues = () => {
    window.clearTimeout(_timeoutId);
    _pollingActive = false;
  };

  const _fetchToggleValues = async () => {
    try {
      // Use platform apiRequest instead of raw fetch
      return await apiRequest(toggleValuesPath, {
        credentials: 'include',
      });
    } catch (error) {
      // CRITICAL: Handle 403 errors by stopping polling
      if (error instanceof Response && error.status === 403) {
        // eslint-disable-next-line no-console
        console.warn(
          'Feature toggles: Authentication failed (403). Stopping polling.',
        );
        _authFailureDetected = true;
        stopPollingToggleValues();
        return { error: 'Authentication failed', status: 403 };
      }

      // For other errors, return error but allow retry
      return { error: error.message || 'Unknown error' };
    }
  };

  const addSubscriberCallback = subscriberCallback =>
    _subscriberCallbacks.push(subscriberCallback) - 1;

  const handleToggleValuesRetrieved = toggleValues =>
    _subscriberCallbacks.forEach(callback => callback(toggleValues));

  const refreshToggleValues = async () => {
    // Don't refresh if auth failed
    if (_authFailureDetected) {
      // eslint-disable-next-line no-console
      console.warn(
        'Feature toggles: Cannot refresh, authentication previously failed.',
      );
      return;
    }

    const result = await _fetchToggleValues();

    // Check if result has toggleValues before accessing
    if (result && result.data) {
      const toggleValues = result.data.features?.reduce((acc, toggle) => {
        acc[toggle.name] = toggle.value;
        return acc;
      }, {});

      if (toggleValues) {
        handleToggleValuesRetrieved(toggleValues);
      }
    }
  };

  const fetchToggleValues = async () => {
    const result = await _fetchToggleValues();

    // Handle error cases
    if (result.error) {
      if (result.status === 403) {
        // Auth failed, return empty toggles
        return {};
      }
      // Other errors, return empty toggles
      // eslint-disable-next-line no-console
      console.warn('Feature toggles: Error fetching toggles:', result.error);
      return {};
    }

    const { data } = result;
    const { features = [] } = data;
    return features.reduce((acc, toggle) => {
      acc[toggle.name] = toggle.value;
      return acc;
    }, {});
  };

  const removeSubscriberCallback = index => {
    _subscriberCallbacks[index] = () => {};

    // IMPROVEMENT: Stop polling if no active subscribers
    const hasActiveSubscribers = _subscriberCallbacks.some(
      callback => callback.toString() !== '(() => {}).toString()',
    );

    if (!hasActiveSubscribers && _pollingActive) {
      stopPollingToggleValues();
    }
  };

  const startPollingToggleValues = async () => {
    // Don't start if auth previously failed
    if (_authFailureDetected) {
      // eslint-disable-next-line no-console
      console.warn(
        'Feature toggles: Cannot start polling, authentication previously failed.',
      );
      return;
    }

    _pollingActive = true;
    const result = await _fetchToggleValues();

    // CRITICAL: Check for auth failure
    if (result.error && result.status === 403) {
      // eslint-disable-next-line no-console
      console.warn(
        'Feature toggles: Polling stopped due to authentication failure.',
      );
      stopPollingToggleValues();
      return;
    }

    if (_pollingActive) {
      // Extract toggleValues from result
      if (result && result.data) {
        const toggleValues = result.data.features?.reduce((acc, toggle) => {
          acc[toggle.name] = toggle.value;
          return acc;
        }, {});

        if (toggleValues) {
          handleToggleValuesRetrieved(toggleValues);
        }
      }

      // Use recursive setTimeout pattern (safer than setInterval)
      _timeoutId = window.setTimeout(
        () => startPollingToggleValues(),
        TOGGLE_POLLING_INTERVAL,
      );
    }
  };

  // Method to reset auth failure flag (for retry scenarios)
  const resetAuthFailure = () => {
    _authFailureDetected = false;
  };

  return {
    addSubscriberCallback,
    fetchToggleValues,
    refreshToggleValues,
    removeSubscriberCallback,
    startPollingToggleValues,
    stopPollingToggleValues,
    resetAuthFailure,
  };
}

export default function makeFlipperClient(options) {
  flipperClientInstance = flipperClientInstance || new FlipperClient(options);

  return flipperClientInstance;
}
