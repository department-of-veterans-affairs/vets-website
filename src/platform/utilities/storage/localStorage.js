// Browser storage methods can be disabled in most browser options, which causes localStorage
// to throw errors. However, even when unavailable, "localStorage" is still a read-only property
// of the window, so we can't polyfill it.

let _storage;

try {
  const testItem = 'testItem';
  localStorage.setItem(testItem, testItem);
  localStorage.removeItem(testItem);
  _storage = localStorage;
} catch (err) {
  _storage = require('local-storage-fallback').storage;
}

const storage = _storage;
export default storage;
