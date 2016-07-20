// TODO(awong): Convert from webpack common.js require() format to ES6 modules.

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

// Enter our application here.
import { init } from './roadrunner-entry';
document.addEventListener('DOMContentLoaded', () => {
  init();
});
