// polyfills are loaded in vendor chunk
require('./polyfills');

require('./sentry.js');

// Used in the footer.
require('../legacy/menu.js');
require('../legacy/toggle-veterans-crisis-line.js');
require('./utils/sticky-action-box.js');

// New navigation menu
require('../legacy/mega-menu.js');
