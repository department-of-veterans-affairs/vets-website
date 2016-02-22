// Add all the ES6 library features that my be missing.
require("babel-polyfill");


// Bring in foundation and custom libraries.
require('foundation/js/foundation/foundation');
require('./components.js');

// Things that run on document.ready().
require('./vendor/jquery-accessible-simple-tooltip-aria.js'); // Only used in facility-locator index and some playbook examples.
require('./vendor/menu.js');

// Poor-man's client-side router. If more than the healthcare-app
// starts using this functionality, then replace with a real client-side
// routing library.
if (window.location.pathname.startsWith('/health-care/form/')) {
  if (__DEV__) {
    // Use code chunking because most pages do not need this piece of JS.
    require.ensure([], function(require) {
      let HealthApp = require('../../_health-care/_js/_form.js');
      $(document).ready(HealthApp.initForm);
      window.HealthApp = HealthApp;  // Attach to window for easy debugging.
    });
  }
}
