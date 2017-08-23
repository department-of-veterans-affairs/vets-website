// Common Javascript environment setup to be used by all entrypoints.
//
// Keep this short. It should mostly be polyfills, global site style, and any
// truly pervasive libraries. Be careful if you are tempted to put jquery or
// other such libraries in here. Most of the site does not use these legacy
// frameworks and it belongs in a lower-level module.

require('babel-polyfill');

// Basic polyfills.
// TODO(awong): These do NOT correctly conditionally load the polyfill.
// The polyfill is always loaded. require.ensure() should be used instead but
// then load ordering needs to be worked out. Fix later.
const Modernizr = require('modernizr');

if (!Modernizr.classlist) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.dataset) {
  require('dataset');  // dataSet accessor support.
}
if (!Modernizr.fetch) {
  require('whatwg-fetch');  // dataSet accessor support.
}

// This polyfill has its own test logic so no need to conditionally require.
require('polyfill-function-prototype-bind');
