import { toggleLoginModal } from "../../site-wide/user-nav/actions";

const TOGGLE_VALUES_PATH = '/toggle.json';
const TOGGLE_POLLING_INTERVAL = 5000;

let flipperClientInstance;

function FlipperClient({
  host = 'http://localhost:3001',
  toggleValuesPath = TOGGLE_VALUES_PATH,
} = {}) {
  let _timeoutId;
  let _pollingActive;
  const _subscriberCallbacks = [];

  const _fetchToggleValues = async function featureToggleValues() {
    const response = await fetch(`${host}${toggleValuesPath}`);
    const responseJson = response.ok
      ? await response.json()
      : new Error(
          `Failed to fetch toggle values with status ${response.status} ${
            response.statusText
          }`,
        );

    if (responseJson instanceof Error) {
      throw responseJson;
    }

    return responseJson;
  };

  const addSubscriberCallback = subscriberCallback =>
    _subscriberCallbacks.push(subscriberCallback) - 1;

  const handleToggleValuesRetrieved = toggleValues =>
    _subscriberCallbacks.forEach(callback => callback(toggleValues));

  const refreshToggleValues = async function refreshToggleValues() {
    const { toggleValues } = await _fetchToggleValues();

    handleToggleValuesRetrieved(toggleValues);
  };

  const fetchToggleValues = async function fetchTogggleValues() {
    const { toggleValues } = await _fetchToggleValues();

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

  const startPollingToggleValues = async function startPollingService() {
    _pollingActive = true;
    const { toggleValues } = await _fetchToggleValues();

    if (_pollingActive) {
      handleToggleValuesRetrieved(toggleValues);

      _timeoutId = window.setTimeout(
        () => startPollingService(),
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
