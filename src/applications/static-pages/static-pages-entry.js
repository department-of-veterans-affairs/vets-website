import '../../platform/polyfills';
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import Raven from 'raven-js';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';

import createAdditionalInfoWidget from './createAdditionalInfoWidget';
import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createMyVALoginWidget from './createMyVALoginWidget';
import createDisabilityIncreaseApplicationStatus from '../disability-benefits/526EZ/components/createDisabilityIncreaseApplicationStatus';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import create526EmailForm from '../disability-benefits/526EZ/components/create526EmailForm';

const pensionPages = new Set([
  '/pension/',
  '/pension/how-to-apply/',
  '/pension/eligibility/',
]);

const healthcarePages = new Set([
  '/health-care/',
  '/health-care/how-to-apply/',
  '/health-care/eligibility/',
]);

const ctaTools = new Set([
  '/claim-or-appeal-status/',
  '/health-care/get-medical-records/',
  '/health-care/refill-track-prescriptions/',
  '/health-care/secure-messaging/',
  '/health-care/schedule-view-va-appointments/',
  '/health-care/view-test-and-lab-results/',
  '/records/download-va-letters/',
  '/records/get-veteran-id-cards/vic/',
]);

const burialPages = new Set([
  '/burials-memorials/',
  '/burials-memorials/veterans-burial-allowance/',
]);

const eduPages = new Set([
  '/education/',
  '/education/eligibility/',
  '/education/how-to-apply/',
]);

const eduOptOutPage = '/education/opt-out-information-sharing/';

const disabilityPages = new Set([
  '/disability/',
  '/disability/how-to-file-claim/',
  '/disability/eligibility/',
]);

// No-react styles.
import './sass/static-pages.scss';

// New sidebar menu
import './sidebar-navigation.js';

const store = createCommonStore();
Raven.context(
  {
    tags: { source: 'site-wide' },
  },
  () => {
    startSitewideComponents(store);
  },
);

Raven.context(
  {
    tags: { source: 'static-pages' },
  },
  () => {
    createAdditionalInfoWidget();

    if (pensionPages.has(location.pathname)) {
      createApplicationStatus(store, {
        formId: '21P-527EZ',
        applyHeading: 'How do I apply?',
        additionalText: 'You can apply online right now.',
        applyLink: '/pension/how-to-apply/',
        applyText: 'Apply for Veterans Pension Benefits',
      });
    }

    if (healthcarePages.has(location.pathname)) {
      createApplicationStatus(store, {
        formId: '1010ez',
        applyHeading: 'How do I apply?',
        additionalText: 'You can apply online right now.',
        applyLink: '/health-care/how-to-apply/',
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

    if (disabilityPages.has(location.pathname)) {
      createDisabilityIncreaseApplicationStatus(store);
    }

    if (
      location.pathname ===
      '/disability-benefits/apply/form-526-disability-claim/'
    ) {
      create526EmailForm(store);
    }

    // homepage widgets
    if (location.pathname === '/') {
      createMyVALoginWidget(store);
    }

    /* eslint-disable no-unused-vars,camelcase */
    const lazyLoad = new LazyLoad({
      elements_selector: '.lazy',
    });
    /* eslint-enable */
  },
);
