// No-react styles.
require('../sass/no-react.scss');

require('./common');

// Bring in foundation and custom libraries.
require('foundation-sites');

// Used in the footer.
require('./legacy/menu.js');
require('./legacy/toggle-veterans-crisis-line.js');
require('./common/utils/sticky-action-box.js');

// New navigation menu
require('./legacy/mega-menu.js');

// New sidebar menu
require('./legacy/sidebar-navigation.js');

require('./login/login-entry.jsx');
