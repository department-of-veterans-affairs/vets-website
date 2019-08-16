import environment from 'platform/utilities/environment';

const TOGGLE_VALUES_PATH =
  '/v0/feature_toggles?features=facilityLocatorShowCommunityCares';
const TOGGLE_POLLING_INTERVAL = 5000;

let flipperClientInstance;

function FlipperClient({
  host = environment.API_URL,
  toggleValuesPath = TOGGLE_VALUES_PATH,
} = {}) {
  let _timeoutId;
  let _pollingActive;
  const _subscriberCallbacks = [];

  const _fetchToggleValues = async () => {
    const response = await fetch(`${host}${toggleValuesPath}`);
    if (!response.ok) {
      const errorMessage = `Failed to fetch toggle values with status ${
        response.status
      } ${response.statusText}`;
      throw new Error(errorMessage);
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
    }
    */
    const { data } = await _fetchToggleValues();
    const { features = [] } = data;
    const toggleValues = features.reduce((acc, toggle) => {
      acc[toggle.name] = toggle.value;

      return acc;
    }, {});

    return toggleValues;
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

function makeFlipperClient() {
  flipperClientInstance = flipperClientInstance || new FlipperClient();

  return flipperClientInstance;
}
export { makeFlipperClient as FlipperClient };
