import createCommonStore from './common/store';
import createLoginWidget from './login/login-entry';

// No-react styles.
require('../sass/no-react.scss');

require('./common');

// Bring in foundation and custom libraries.
require('foundation-sites');

// Used in the footer.
require('./legacy/menu.js');
require('./common/utils/sticky-action-box.js');

// New navigation menu
require('./legacy/mega-menu.js');

// New sidebar menu
require('./legacy/sidebar-navigation.js');

if (__BUILDTYPE__ !== 'production' && location.href.endsWith('education/apply-wizard/')) {
  require('./edu-benefits/education-wizard.js');
}

createLoginWidget(createCommonStore());
