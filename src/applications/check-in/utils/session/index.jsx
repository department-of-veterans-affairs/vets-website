const sessionNameSpace = 'health.care.check-in.';

const SESSION_STORAGE_KEYS = Object.freeze({
  CURRENT_UUID: `${sessionNameSpace}current.uuid`,
  MAX_VALIDATE_LIMIT: `${sessionNameSpace}max.validate.limit`,
});

const clearCurrentSession = window => {
  const { sessionStorage } = window;
  const { CURRENT_UUID, MAX_VALIDATE_LIMIT } = SESSION_STORAGE_KEYS;
  sessionStorage.removeItem(CURRENT_UUID);
  sessionStorage.removeItem(MAX_VALIDATE_LIMIT);
};

const setCurrentToken = (window, token) => {
  const { sessionStorage } = window;
  const { CURRENT_UUID } = SESSION_STORAGE_KEYS;
  const key = CURRENT_UUID;
  const data = { token };
  sessionStorage.setItem(key, JSON.stringify(data));
};

const setMaxValidateLimit = (window, maxValidateLimit) => {
  const { sessionStorage } = window;
  const { MAX_VALIDATE_LIMIT } = SESSION_STORAGE_KEYS;
  const key = MAX_VALIDATE_LIMIT;
  const data = { maxValidateLimit };
  sessionStorage.setItem(key, JSON.stringify(data));
};

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

const getMaxValidateLimit = window => {
  if (!window) return null;
  const { sessionStorage } = window;
  const { MAX_VALIDATE_LIMIT } = SESSION_STORAGE_KEYS;

  const key = MAX_VALIDATE_LIMIT;

  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export {
  clearCurrentSession,
  getCurrentToken,
  getMaxValidateLimit,
  setCurrentToken,
  setMaxValidateLimit,
};
