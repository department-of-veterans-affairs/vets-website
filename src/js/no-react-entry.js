import createCommonStore from './common/store';
import createLoginWidget from './login/login-entry';
import createApplicationStatus from './common/components/createApplicationStatus';

const wizardPages = new Set(['/education/apply/', '/education/eligibility/']);
const pensionPages = new Set(['/pension/', '/pension/apply/', '/pension/eligibility/']);
const healthcarePages = new Set(['/health-care/', '/health-care/apply/', '/health-care/eligibility/']);
const burialPages = new Set(['/burials-and-memorials/', '/burials-and-memorials/survivor-and-dependent-benefits/', '/burials-and-memorials/survivor-and-dependent-benefits/burial-costs/']);
// No-react styles.
import '../sass/no-react.scss';

import './common';

// Used in the footer.
import './legacy/menu.js';

// New navigation menu
import './legacy/mega-menu.js';

// New sidebar menu
import './legacy/sidebar-navigation.js';

if (wizardPages.has(location.pathname)) {
  require('./edu-benefits/education-wizard.js');
}

const store = createCommonStore();
createLoginWidget(store);
if (pensionPages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '21P-527EZ',
    applyLink: '/pension/apply/',
    applyText: 'Apply for Veterans Pension Benefits'
  });
}
if (healthcarePages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '1010ez',
    additionalText: 'You can start your online application right now.',
    applyLink: '/health-care/apply/',
    applyText: 'Apply for Health Care Benefits'
  }, 'hca-start-text');
}
if (burialPages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '21P-530',
    applyText: 'Apply for Burial Benefits'
  });
}
