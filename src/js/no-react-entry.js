import '../platform/polyfills';

import createCommonStore from '../platform/startup/store';
import startSitewideComponents from '../platform/site-wide';

import createApplicationStatus from './common/components/createApplicationStatus';
import createEducationApplicationStatus from './edu-benefits/components/createEducationApplicationStatus';
import createDisabilityIncreaseApplicationEntry from './disability-benefits/526EZ/components/createDisabilityIncreaseApplicationEntry';

// const pensionPages = new Set(['/pension/', '/pension/apply/', '/pension/eligibility/']);
const healthcarePages = new Set(['/health-care/', '/health-care/apply/', '/health-care/eligibility/']);
// const burialPages = new Set(['/burials-and-memorials/', '/burials-and-memorials/survivor-and-dependent-benefits/']);
const eduPages = new Set(['/education/', '/education/apply/', '/education/eligibility/']);
const disabilityPages = new Set(['/disability-benefits/apply/', '/disability-benefits/eligibility/']);

// No-react styles.
import '../sass/no-react.scss';

// New sidebar menu
import './legacy/sidebar-navigation.js';

const store = createCommonStore();
startSitewideComponents(store);

// if (pensionPages.has(location.pathname)) {
//   createApplicationStatus(store, {
//     formId: '21P-527EZ',
//     applyLink: '/pension/apply/',
//     applyText: 'Apply for Veterans Pension Benefits'
//   });
// }
if (healthcarePages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '1010ez',
    additionalText: 'You can start your online application right now.',
    applyLink: '/health-care/apply/',
    applyText: 'Apply for Health Care Benefits'
  });
}
if (eduPages.has(location.pathname)) {
  createEducationApplicationStatus(store);
}
if (disabilityPages.has(location.pathname)) {
  createDisabilityIncreaseApplicationEntry(store);
}
// if (burialPages.has(location.pathname)) {
//   createApplicationStatus(store, {
//     formId: '21P-530',
//     applyText: 'Apply for Burial Benefits'
//   });
// }
