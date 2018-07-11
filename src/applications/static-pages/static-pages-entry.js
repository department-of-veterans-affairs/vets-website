import '../../platform/polyfills';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import createApplicationStatus from './createApplicationStatus';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createDisabilityIncreaseApplicationStatus from '../disability-benefits/526EZ/components/createDisabilityIncreaseApplicationStatus';

const pensionPages = new Set(['/pension/', '/pension/apply/', '/pension/eligibility/']);
const healthcarePages = new Set(['/health-care/', '/health-care/apply/', '/health-care/eligibility/']);
const burialPages = new Set([
  '/burials-and-memorials/',
  '/burials-and-memorials/survivor-and-dependent-benefits/burial-costs/'
]);
const eduPages = new Set(['/education/', '/education/apply/', '/education/eligibility/']);
const eduOptOutPage = '/education/opt-out/';
const disabilityPages = new Set(['/disability-benefits/', '/disability-benefits/apply/', '/disability-benefits/eligibility/']);

// No-react styles.
import './sass/static-pages.scss';

// New sidebar menu
import './sidebar-navigation.js';

const store = createCommonStore();
startSitewideComponents(store);

if (pensionPages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '21P-527EZ',
    applyHeading: 'How do I apply?',
    additionalText: 'You can apply online right now.',
    applyLink: '/pension/apply/',
    applyText: 'Apply for Veterans Pension Benefits'
  });
}
if (healthcarePages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '1010ez',
    applyHeading: 'How do I apply?',
    additionalText: 'You can apply online right now.',
    applyLink: '/health-care/apply/',
    applyText: 'Apply for Health Care Benefits'
  });
}
if (eduPages.has(location.pathname)) {
  createEducationApplicationStatus(store);
}
if (location.pathname === eduOptOutPage) {
  createEducationApplicationStatus(store);
}
if (burialPages.has(location.pathname)) {
  createApplicationStatus(store, {
    formId: '21P-530',
    applyHeading: 'How do I apply?',
    additionalText: 'You can apply online right now.',
    applyText: 'Apply for Burial Benefits'
  });
}

if (disabilityPages.has(location.pathname) && __BUILDTYPE__ !== 'production') {
  createDisabilityIncreaseApplicationStatus(store);
}
