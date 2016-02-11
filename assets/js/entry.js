// Get our browser up to date with polyfills.
let Modernizr = require("modernizr");
if (!Modernizr.classlist) {
  require('classlist-polyfill'); // DOM element classList support.
}
if (!Modernizr.dataset) {
  require('dataset');  // dataSet accessort support.
}


// Bring in foundation and custom libraries.
require('foundation/js/foundation/foundation');
let WOW = require('wow.js/src/wow.coffee');
new WOW().init();
require('./components.js');

// Things that run on document.ready().
require('./vendor/jquery-accessible-simple-tooltip-aria.js'); // Only used in facility-locator index and some playbook examples.
require('./vendor/menu.js');

// Poor-man's client-side router. If more than the healthcare-app
// starts using this functionality, then replace with a real client-side
// routing library.
if (window.location.pathname === '/health-care/form.html') {
  if (__DEV__) {
    // Use code chunking because most pages do not need this piece of JS.
    require.ensure([], function(require) {
      let HealthApp = require('../../_health-care/_js/_form.js');
      $(document).ready(HealthApp.initForm);
      window.HealthApp = HealthApp;  // Attach to window for easy debugging.
    });
  }
}
