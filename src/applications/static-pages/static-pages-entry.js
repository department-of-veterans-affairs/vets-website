import '../../platform/polyfills';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createMyVALoginWidget from './createMyVALoginWidget';
import createDisabilityIncreaseApplicationStatus from '../disability-benefits/526EZ/components/createDisabilityIncreaseApplicationStatus';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import create526EmailForm from '../disability-benefits/526EZ/components/create526EmailForm';

import brandConsolidation from '../../platform/brand-consolidation';

const pensionPages = new Set([
  '/pension/',
  '/pension/apply/',
  '/pension/how-to-apply/',
  '/pension/eligibility/',
]);

const healthcarePages = new Set([
  '/health-care/',
  '/health-care/apply/',
  '/health-care/how-to-apply/',
  '/health-care/eligibility/',
]);

const ctaTools = new Set([
  '/health-care/secure-messaging/',
  '/health-care/refill-track-prescriptions/',
  '/health-care/schedule-view-va-appointments/',
  '/health-care/view-test-and-lab-results/',
  '/claim-or-appeal-status/',
]);

const burialPages = new Set([
  '/burials-and-memorials/',
  '/burials-and-memorials/survivor-and-dependent-benefits/burial-costs/',
  '/burials-memorials/veterans-burial-allowance/',
]);

const eduPages = new Set([
  '/education/',
  '/education/apply/',
  '/education/eligibility/',
  '/education/how-to-apply/',
]);

const eduOptOutPage = '/education/opt-out-information-sharing/';

const disabilityPages = new Set([
  // Vets.gov paths
  '/disability-benefits/',
  '/disability-benefits/apply/',
  '/disability-benefits/eligibility/',
  // VA.gov paths
  '/disability/',
  '/disability/how-to-file-claim/',
  '/disability/eligibility/',
]);

// No-react styles.
import './sass/static-pages.scss';

// New sidebar menu
import './sidebar-navigation.js';

const store = createCommonStore();
startSitewideComponents(store);

if (pensionPages.has(location.pathname)) {
  const applyLink = brandConsolidation.isEnabled()
    ? '/pension/how-to-apply/'
    : '/pension/apply/';
  createApplicationStatus(store, {
    formId: '21P-527EZ',
    applyHeading: 'How do I apply?',
    additionalText: 'You can apply online right now.',
    applyLink,
    applyText: 'Apply for Veterans Pension Benefits',
  });
}

if (healthcarePages.has(location.pathname)) {
  const applyLink = brandConsolidation.isEnabled()
    ? '/health-care/how-to-apply/'
    : '/health-care/apply/';
  createApplicationStatus(store, {
    formId: '1010ez',
    applyHeading: 'How do I apply?',
    additionalText: 'You can apply online right now.',
    applyLink,
    applyText: 'Apply for Health Care Benefits',
  });
}

if (ctaTools.has(location.pathname)) {
  createCallToActionWidget(store);
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
    applyText: 'Apply for Burial Benefits',
  });
}

if (disabilityPages.has(location.pathname) && __BUILDTYPE__ !== 'production') {
  createDisabilityIncreaseApplicationStatus(store);
}

if (location.pathname === '/disability-benefits/increase-claims-testing/') {
  create526EmailForm(store);
}

// homepage widgets
if (location.pathname === '/') {
  createMyVALoginWidget(store);
}
