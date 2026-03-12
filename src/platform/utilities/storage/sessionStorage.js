const mockStore = {};
const mockSessionStorage = {
  getItem: key => (key in mockStore ? mockStore[key] : null),
  setItem: (key, value) => {
    mockStore[key] = String(value);
  },
  removeItem: key => {
    delete mockStore[key];
  },
  clear: () => {
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
  },
};

function getSessionStorage() {
  try {
    const testItem = 'testItem';
    const { sessionStorage } = window;
    sessionStorage.setItem(testItem, testItem);
    sessionStorage.removeItem(testItem);
    return sessionStorage;
  } catch (err) {
    // Do Nothing, session will not be persisted.
    return mockSessionStorage;
  }
}

export default getSessionStorage();
