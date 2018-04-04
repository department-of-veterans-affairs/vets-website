// Common Javascript environment setup to be used by all entrypoints.
//
// Keep this short. It should mostly be polyfills, global site style, and any
// truly pervasive libraries. Be careful if you are tempted to put jquery or
// other such libraries in here. Most of the site does not use these legacy
// frameworks and it belongs in a lower-level module.

import 'babel-polyfill';

// Basic polyfills.
import Modernizr from 'modernizr';

import './canvas-toBlob';

if (!Modernizr.classlist) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.dataset) {
  require('dataset');  // dataSet accessor support.
}

// Edge 14's fetch implementation throws TypeMismatchErrors seemingly without
// reason. This is fixed in fetch 15, but we should use the (xhr based) polyfill
// for 14.
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/
if (navigator.userAgent.includes('Edge/14')) {
  window.fetch = undefined;
}

// This needs to stay as require because import causes it to be executed before the
// above code
require('whatwg-fetch');

