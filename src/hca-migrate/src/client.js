// Detect if this is a child frame. If yes, initialize the react devtools hook to work around
//   https://github.com/facebook/react-devtools/issues/57
// This must occur before any react code is loaded.
if (window.parent !== window) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

require('../assets/css/main.scss'); // All style assets for this project.

// Get our browser up to date with polyfills.
const Modernizr = require('modernizr');
if (!Modernizr.classlist) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.dataset) {
  require('dataset');  // dataSet accessor support.
}

// This polyfill has its own test logic so no need to conditionally require.
require('polyfill-function-prototype-bind');

const ReactEntry = require('./client/react-entry.jsx');
document.addEventListener('DOMContentLoaded', () => { // eslint-disable-line scanjs-rules/call_addEventListener
  ReactEntry.init();
});
window.ReactEntry = ReactEntry;  // Attach to window for easy debugging.

require('../assets/js/vendor/toggle-veterans-crisis-line.js');
