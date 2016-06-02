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

// Poor-man's client-side router. If more than the healthcare-app
// starts using this functionality, then replace with a real client-side
// routing library.
if (window.location.pathname.startsWith('/healthcare/form/')) {
  if (__DEV__) {
    // Use code chunking because most pages do not need this piece of JS.
    require.ensure([], (require) => {
      const HealthApp = require('../../_healthcare/_js/_form.js');
      $(document).ready(HealthApp.initForm);
      window.HealthApp = HealthApp;  // Attach to window for easy debugging.
    });
  }
} else if (window.location.pathname.startsWith('/healthcare/form-react/')) {
  if (__DEV__) {
    // Use code chunking because most pages do not need this piece of JS.
    require.ensure([], (require) => {
      const ReactEntry = require('../../_healthcare/_js/react-entry.jsx');
      $(document).ready(ReactEntry.init);
      window.ReactEntry = ReactEntry;  // Attach to window for easy debugging.
    });
  }
}
