/**
 * @param {object} mockStore An object that holds your test data
 * @returns {object} A mock store that has session storage functionality
 */
export const sessionStorageSetup = mockStore => {
  const updatedMockStore = mockStore;
  updatedMockStore.sessionStorage = {};
  global.sessionStorage = {
    getItem: key =>
      key in updatedMockStore.sessionStorage
        ? updatedMockStore.sessionStorage[key]
        : null,
    setItem: (key, value) => {
      updatedMockStore.sessionStorage[key] = value;
    },
    removeItem: key => delete updatedMockStore.sessionStorage[key],
    clear: () => {
      updatedMockStore.sessionStorage = {};
    },
  };
};
