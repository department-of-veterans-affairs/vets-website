import 'platform/polyfills';
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import * as Sentry from '@sentry/browser';

import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';
import { VA_FORM_IDS } from 'platform/forms/constants';

import './analytics';
import './alerts-dismiss-view';
import './ics-generator';
import createFacilityPage from './facilities/createFacilityPage';

import widgetTypes from './widgetTypes';
import subscribeAdditionalInfoEvents from './subscribeAdditionalInfoEvents';
import subscribeAccordionEvents from './subscribeAccordionEvents';
import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createMyVALoginWidget from './createMyVALoginWidget';
import createHomepageBanner from './homepage-banner/createHomepageBanner';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createDisabilityRatingCalculator from '../disability-benefits/disability-rating-calculator/createCalculator';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import createFindVaForms, {
  findVaFormsWidgetReducer,
} from '../find-forms/createFindVaForms';
import createHigherLevelReviewApplicationStatus from 'applications/disability-benefits/996/components/createHLRApplicationStatus';
import createPost911GiBillStatusWidget, {
  post911GIBillStatusReducer,
} from '../post-911-gib-status/createPost911GiBillStatusWidget';

import create686ContentReveal from './view-modify-dependent/686-cta/create686CcontentReveal.js';

// No-react styles.
import './sass/static-pages.scss';

// Social share links behavior
import './social-share-links';

// Health care facility widgets
import createFacilityListWidget from './facilities/facilityList';
import createBasicFacilityListWidget from './facilities/basicFacilityList';
import facilityReducer from './facilities/reducers';
import createOtherFacilityListWidget from './facilities/otherFacilityList';

import createViewDependentsCTA from './view-modify-dependents/view-dependents-cta/createViewDependentsCTA';

// School resources widgets
import {
  createScoEventsWidget,
  createScoAnnouncementsWidget,
} from './school-resources/SchoolResources';
import createCoronavirusChatbot from '../coronavirus-chatbot/createCoronavirusChatbot';

// Set the app name header when using the apiRequest helper
window.appName = 'static-pages';

// Set further errors to have the appropriate source tag
Sentry.configureScope(scope => scope.setTag('source', 'static-pages'));

const store = createCommonStore({
  ...facilityReducer,
  ...findVaFormsWidgetReducer,
  ...post911GIBillStatusReducer,
});

Sentry.withScope(scope => {
  scope.setTag('source', 'site-wide');
  startSitewideComponents(store);
});

subscribeAdditionalInfoEvents();

subscribeAccordionEvents();

createApplicationStatus(store, {
  formId: VA_FORM_IDS.FORM_21P_527EZ,
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyLink: '/pension/how-to-apply/',
  applyText: 'Apply for Veterans Pension benefits',
  widgetType: widgetTypes.PENSION_APP_STATUS,
});

createApplicationStatus(store, {
  formId: VA_FORM_IDS.FORM_10_10EZ,
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyLink: '/health-care/how-to-apply/',
  applyText: 'Apply for health care benefits',
  widgetType: widgetTypes.HEALTH_CARE_APP_STATUS,
});

createCallToActionWidget(store, widgetTypes.CTA);

createEducationApplicationStatus(store, widgetTypes.EDUCATION_APP_STATUS);

createOptOutApplicationStatus(store, widgetTypes.OPT_OUT_APP_STATUS);

createHigherLevelReviewApplicationStatus(
  store,
  widgetTypes.HIGHER_LEVEL_REVIEW_APP_STATUS,
);

createApplicationStatus(store, {
  formId: VA_FORM_IDS.FORM_21P_530,
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyText: 'Apply for burial benefits',
  widgetType: widgetTypes.BURIALS_APP_STATUS,
});

createDisabilityFormWizard(store, widgetTypes.DISABILITY_APP_STATUS);
createDisabilityRatingCalculator(
  store,
  widgetTypes.DISABILITY_RATING_CALCULATOR,
);

createFacilityListWidget();
createOtherFacilityListWidget();
createFacilityPage(store);
createBasicFacilityListWidget();

createScoEventsWidget();
createScoAnnouncementsWidget();

createFindVaForms(store, widgetTypes.FIND_VA_FORMS);
createPost911GiBillStatusWidget(
  store,
  widgetTypes.POST_911_GI_BILL_STATUS_WIDGET,
);

createCoronavirusChatbot(store, widgetTypes.CORONAVIRUS_CHATBOT);

createHomepageBanner(store, widgetTypes.HOMEPAGE_BANNER);

createViewDependentsCTA(store, widgetTypes.VIEW_DEPENDENTS_CTA);
create686ContentReveal(store, widgetTypes.FORM_686_CONTENT_REVEAL);

// homepage widgets
if (location.pathname === '/') {
  createMyVALoginWidget(store);
}

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
