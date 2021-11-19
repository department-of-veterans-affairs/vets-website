const sessionNameSpace = 'health.care.check-in.';

const SESSION_STORAGE_KEYS = Object.freeze({
  CURRENT_UUID: `${sessionNameSpace}current.uuid`,
});

/**
 * @param {Window} window
 */
const clearCurrentSession = window => {
  const { sessionStorage } = window;
  const { CURRENT_UUID } = SESSION_STORAGE_KEYS;
  sessionStorage.removeItem(CURRENT_UUID);
};

/**
 * @param {Window} window
 * @param {string} token
 */
const setCurrentToken = (window, token) => {
  const { sessionStorage } = window;
  const { CURRENT_UUID } = SESSION_STORAGE_KEYS;
  const key = CURRENT_UUID;
  const data = { token };
  sessionStorage.setItem(key, JSON.stringify(data));
};

/**
 * @param {Window} window
 */
const getCurrentToken = window => {
  if (!window) return null;
  const { sessionStorage } = window;
  const { CURRENT_UUID } = SESSION_STORAGE_KEYS;

  const key = CURRENT_UUID;

  const data = sessionStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};
export { clearCurrentSession, getCurrentToken, setCurrentToken };
