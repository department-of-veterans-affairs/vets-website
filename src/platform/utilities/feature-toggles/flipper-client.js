/* This file is must run in both NodeJS and browser environments */

import { apiRequest } from '../api';
import { getFlipperId } from './helpers';

const FLIPPER_ID = getFlipperId();
const TOGGLE_VALUES_PATH = `/v0/feature_toggles?cookie_id=${FLIPPER_ID}`;
const TOGGLE_POLLING_INTERVAL = 5000;

let flipperClientInstance;

function FlipperClient({
  host = 'http://localhost:3000',
  toggleValuesPath = TOGGLE_VALUES_PATH,
} = {}) {
  let _timeoutId;
  let _pollingActive;
  const _subscriberCallbacks = [];

  const _fetchToggleValues = async () => {
    try {
      return await apiRequest(`${host}${toggleValuesPath}`);
    } catch (error) {
      return { error };
    }
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
    }
    */
    const result = await _fetchToggleValues();

    if (result.error) {
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
