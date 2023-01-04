const mockSessionStorage = {
  setItem: () => {},
  removeItem: () => {},
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
