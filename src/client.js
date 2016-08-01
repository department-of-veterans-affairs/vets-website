// Detect if this is a child frame. If yes, initialize the react devtools hook to work around
//   https://github.com/facebook/react-devtools/issues/57
// This must occur before any react code is loaded.
if (window.parent !== window) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

require('../sass/style.scss');

// Get our browser up to date with polyfills.
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

// This polyfill has its own test logic so no need to conditionally require.
require('polyfill-function-prototype-bind');

// TODO(awong): Change this entry to something with a global router.
const ReactEntry = require('./rx/roadrunner-entry.jsx');
document.addEventListener('DOMContentLoaded', () => { // eslint-disable-line scanjs-rules/call_addEventListener
  ReactEntry.init();
});
