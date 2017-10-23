import createCommonStore from './common/store';
import createLoginWidget from './login/login-entry';
import createApplicationStatus from './common/components/createApplicationStatus';
import createEducationApplicationStatus from './edu-benefits/components/createEducationApplicationStatus';

const pensionPages = new Set(['/pension/', '/pension/apply/', '/pension/eligibility/']);
const healthcarePages = new Set(['/health-care/', '/health-care/apply/', '/health-care/eligibility/']);
const eduPages = new Set(['/education/', '/education/apply/', '/education/eligibility/']);

// No-react styles.
require('../sass/no-react.scss');

require('./common');

// Used in the footer.
require('./legacy/menu.js');

// New navigation menu
require('./legacy/mega-menu.js');

// New sidebar menu
require('./legacy/sidebar-navigation.js');

const store = createCommonStore();
createLoginWidget(store);
if (pensionPages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '21P-527EZ',
    applyText: 'Apply for Veterans Pension'
  });
}
if (healthcarePages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '1010ez',
    additionalText: 'You can start your online application right now.',
    applyText: 'Apply for Health Care Benefits',
  });
}
if (eduPages.has(location.pathname)) {
  createEducationApplicationStatus(store);
}
