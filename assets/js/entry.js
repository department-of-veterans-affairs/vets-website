"use strict;"

// Get our browser up to date with polyfills.
require("modernizr");
require('html5shiv');  // Section support in older browsers.
require('classlist-polyfill'); // DOM element classList support.
require('dataset');  // dataSet accessort support.


// Bring in foundation and custom libraries.
require('foundation/js/foundation/foundation');
var WOW = require('wow.js/src/wow.coffee');
new WOW().init();
require('./components.js');

// Things that run on document.ready().
require('./vendor/jquery-accessible-simple-tooltip-aria.js'); // Only used in facility-locator index and some playbook examples.
require('./vendor/menu.js');
