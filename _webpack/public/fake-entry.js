// Add all the ES6 library features that my be missing.
require('babel-polyfill');

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

// Bring in foundation and custom libraries.
require('foundation/js/foundation/foundation');

const ReactEntry = require('../../_health-care/_js/react-entry.jsx');
document.addEventListener('DOMContentLoaded', () => {
  ReactEntry.init();
});
window.ReactEntry = ReactEntry;  // Attach to window for easy debugging.
