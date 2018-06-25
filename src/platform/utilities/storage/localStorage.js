// Browser storage methods can be disabled in most browser options, which causes localStorage
// to throw errors. However, even when unavailable, "localStorage" is still a read-only property
// of the window, so we can't polyfill it.
// To resolve, we centralize access to localStorage so that we can control the data structure
// without needing to touch the window.localStorage property.

function getLocalStorage() {
  try {
    const testItem = 'testItem';
    const localStorage = window.localStorage;
    localStorage.setItem(testItem, testItem);
    localStorage.removeItem(testItem);
    return localStorage;
  } catch (err) {
    // Probably a SecurityError
    return require('local-storage-fallback').storage;
  }
}

export default getLocalStorage();
