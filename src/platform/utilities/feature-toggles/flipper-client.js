/* This file is must run in both NodeJS and browser environments */

import { getFlipperId } from './helpers';

const FLIPPER_ID = getFlipperId();
const TOGGLE_VALUES_PATH = `/v0/feature_toggles?&cookie_id=${FLIPPER_ID}`;
const TOGGLE_POLLING_INTERVAL = 5000;
const TOGGLE_STORAGE_KEY = 'featureToggles';
const TOGGLE_STORAGE_EXPIRATION_MINUTES = 15;

let flipperClientInstance;

function FlipperClient({
  host = 'http://localhost:3000',
  toggleValuesPath = TOGGLE_VALUES_PATH,
} = {}) {
  let _timeoutId;
  let _pollingActive;
  const _subscriberCallbacks = [];
  const csrfTokenStored = localStorage.getItem('csrfToken');

  const _fetchToggleValues = async () => {
    const response = await fetch(`${host}${toggleValuesPath}`, {
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfTokenStored,
      },
    });
    if (!response.ok) {
      const errorMessage = `Failed to fetch toggle values with status ${
        response.status
      } ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Get CSRF Token from API header
    const csrfToken = response.headers.get('X-CSRF-Token');

    if (csrfToken && csrfToken !== csrfTokenStored) {
      localStorage.setItem('csrfToken', csrfToken);
    }

    return response.json();
  };

  const addSubscriberCallback = subscriberCallback =>
    _subscriberCallbacks.push(subscriberCallback) - 1;

  const handleToggleValuesRetrieved = toggleValues =>
    _subscriberCallbacks.forEach(callback => callback(toggleValues));

  const refreshToggleValues = async () => {
    const { toggleValues } = await _fetchToggleValues();

    handleToggleValuesRetrieved(toggleValues);
  };

  const fetchToggleValues = async () => {
    /*
    {
      "data":{
          "type":"feature_toggles",
          "features":[
            {
                "name":"foo",
                "value":false
            },
            {
                "name":"another_toggle",
                "value":true
            }
          ]
      }
      */
    let data;
    const queryParams = new URLSearchParams(window.location.search);
    const isToggleCacheDisabled =
      queryParams.get('disableFlipperCache') === 'true';

    const featureToggleSessionData =
      sessionStorage.getItem(TOGGLE_STORAGE_KEY) &&
      JSON.parse(sessionStorage.getItem(TOGGLE_STORAGE_KEY));

    const isSessionDataValid =
      featureToggleSessionData &&
      Date.now() < new Date(featureToggleSessionData.expiresAt).getTime();

    if (!isToggleCacheDisabled && isSessionDataValid) {
      data = featureToggleSessionData.data;
    } else {
      const response = await _fetchToggleValues();
      data = response.data;

      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + 60000 * TOGGLE_STORAGE_EXPIRATION_MINUTES,
      );

      sessionStorage.setItem(
        TOGGLE_STORAGE_KEY,
        JSON.stringify({ expiresAt: expiresAt.toISOString(), data }),
      );
    }

    const { features = [] } = data;
    return features.reduce((acc, toggle) => {
      acc[toggle.name] = toggle.value;

      return acc;
    }, {});
  };

  const removeSubscriberCallback = index => {
    // TODO: stop polling if no subscribers
    _subscriberCallbacks[index] = () => {};
  };

  const stopPollingToggleValues = () => {
    window.clearTimeout(_timeoutId);
    _pollingActive = false;
  };

  const startPollingToggleValues = async () => {
    _pollingActive = true;
    const { toggleValues } = await _fetchToggleValues();

    if (_pollingActive) {
      handleToggleValuesRetrieved(toggleValues);

      _timeoutId = window.setTimeout(
        () => startPollingToggleValues(),
        TOGGLE_POLLING_INTERVAL,
      );
    }
  };

  return {
    addSubscriberCallback,
    fetchToggleValues,
    refreshToggleValues,
    removeSubscriberCallback,
    startPollingToggleValues,
    stopPollingToggleValues,
  };
}

export default function makeFlipperClient(options) {
  flipperClientInstance = flipperClientInstance || new FlipperClient(options);

  return flipperClientInstance;
}
