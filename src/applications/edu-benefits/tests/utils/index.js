/**
 * @param {object} sessionStorage An object that holds your sessionStorage data
 * @returns {object} A mock store that has session storage functionality
 */
export const sessionStorageSetup = sessionStorage => {
  let newSessionStorage = sessionStorage;
  global.sessionStorage = {
    getItem: key =>
      key in global.sessionStorage ? newSessionStorage[key] : null,
    setItem: (key, value) => {
      newSessionStorage[key] = value;
    },
    removeItem: key => delete newSessionStorage[key],
    clear: () => {
      newSessionStorage = {};
    },
  };
  return newSessionStorage;
};
