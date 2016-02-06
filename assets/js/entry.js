"use strict;"

// Get our browser up to date with polyfills.
require("!modernizr!../../.modernizrrc");
require('html5shiv');  // Section support in older browsers.
require('classlist-polyfill'); // DOM element classList support.
require('dataset');  // dataSet accessort support.


// Bring in foundation and custom libraries.
require('foundation/js/foundation/foundation');
var WOW = require('exports?this.WOW!wow.js/src/wow.coffee');
new WOW().init();
require('./components.js');

// Things that run on document.ready().
require('./vendor/jquery-accessible-simple-tooltip-aria.js');
require('./vendor/menu.js');
