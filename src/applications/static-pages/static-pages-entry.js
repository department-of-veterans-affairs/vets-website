import '../../platform/polyfills';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createDisabilityIncreaseApplicationStatus from '../disability-benefits/526EZ/components/createDisabilityIncreaseApplicationStatus';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import create526EmailForm from '../disability-benefits/526EZ/components/create526EmailForm';

const pensionPages = new Set(['/pension/', '/pension/apply/', '/pension/eligibility/']);

const healthcarePages = new Set(['/health-care/', '/health-care/how-to-apply/', '/health-care/eligibility/']);

const healthcareTools = new Set([
  '/health-care/secure-messaging/',
  '/health-care/refill-track-prescriptions/',
  '/health-care/schedule-view-va-appointments/',
  '/health-care/view-test-and-lab-results/'
]);

const burialPages = new Set([
  '/burials-and-memorials/',
  '/burials-and-memorials/survivor-and-dependent-benefits/burial-costs/',
  '/burials-memorials/veterans-burial-allowance/'
]);

const eduPages = new Set(['/education/', '/education/apply/', '/education/eligibility/', '/education/how-to-apply/']);

const eduOptOutPage = '/education/opt-out-information-sharing/';

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
    applyLink: '/health-care/how-to-apply/',
    applyText: 'Apply for Health Care Benefits'
  });
}

if (healthcareTools.has(location.pathname)) {
  createCallToActionWidget();
}

if (eduPages.has(location.pathname)) {
  createEducationApplicationStatus(store);
}

if (location.pathname === eduOptOutPage) {
  createOptOutApplicationStatus(store);
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

if (location.pathname === '/disability-benefits/increase-claims-testing/') {
  create526EmailForm(store);
}
