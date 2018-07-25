// Browser storage methods can be disabled in most browser options, which causes localStorage
// to throw errors. However, even when unavailable, "localStorage" is still a read-only property
// of the window, so we can't polyfill it.

// To resolve this, we centralize access to localStorage so that we can control the data structure
// without needing to touch the window.localStorage property.

// Ideally, we would use the Modernizr feature-detect for localStorage, but this isn't compatible
// with our unit tests because of a requirejs error, and the pattern of always importing localStorage
// as a module rather than directly through the window is easier to enforce when we aren't making
// exceptions in our test cases.

// More info on browser errors in the Modernizr source -
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js

import localStorageFallback from 'local-storage-fallback';

function getLocalStorage() {
  try {
    const testItem = 'testItem';
    const localStorage = window.localStorage;
    localStorage.setItem(testItem, testItem);
    localStorage.removeItem(testItem);
    return localStorage;
  } catch (err) {
    // Probably a SecurityError
    return localStorageFallback;
  }
}

export default getLocalStorage();
