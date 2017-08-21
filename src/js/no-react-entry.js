import createCommonStore from './common/store';
import createLoginWidget from './login/login-entry';

const wizardPages = new Set(['/education/apply/', '/education/eligibility/']);

// No-react styles.
require('../sass/no-react.scss');

require('./common');

// Used in the footer.
require('./legacy/menu.js');
require('./common/utils/sticky-action-box.js');

// New navigation menu
require('./legacy/mega-menu.js');

// New sidebar menu
require('./legacy/sidebar-navigation.js');

if (wizardPages.has(location.pathname)) {
  require('./edu-benefits/education-wizard.js');
}

createLoginWidget(createCommonStore());
