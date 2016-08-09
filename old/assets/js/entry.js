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
require('./components.js');

// Things that run on document.ready().
require('./vendor/jquery-accessible-simple-tooltip-aria.js'); // Only used in facility-locator index and some playbook examples.
require('./vendor/menu.js');
require('./toggle-veterans-crisis-line.js');

