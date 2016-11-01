// Global site style.
require('../sass/style.scss');

require('./common');

// Bring in foundation and custom libraries.
require('foundation-sites');
require('./legacy/components.js');

// Only used in facility-locator index and some playbook examples.
require('jquery-accessible-simple-tooltip-aria/jquery-accessible-simple-tooltip-aria.js');

// Used in the footer.
require('./legacy/menu.js');
require('./legacy/toggle-veterans-crisis-line.js');
require('./common/utils/sticky-action-box.js');

require('./login/login-entry.jsx');
