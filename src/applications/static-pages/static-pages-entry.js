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
import subscribeComponentAnalyticsEvents from './subscribeComponentAnalyticsEvents';
import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createMyVALoginWidget from './createMyVALoginWidget';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createDisabilityRatingCalculator from '../disability-benefits/disability-rating-calculator/createCalculator';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import createFindVaForms, {
  findVaFormsWidgetReducer,
} from '../find-forms/createFindVaForms';
import createFindVaFormsInvalidPdfAlert from '../find-forms/widgets/createInvalidPdfAlert';
import createHigherLevelReviewApplicationStatus from 'applications/disability-benefits/996/components/createHLRApplicationStatus';
import createPost911GiBillStatusWidget, {
  post911GIBillStatusReducer,
} from '../post-911-gib-status/createPost911GiBillStatusWidget';

import form686CTA from './view-modify-dependent/686-cta/form686CTA';

// Health Care | Manage Benefits widgets.
import createGetMedicalRecordsPage from './health-care-manage-benefits/get-medical-records-page';
import createRefillTrackPrescriptionsPage from './health-care-manage-benefits/refill-track-prescriptions-page';
import createScheduleViewVAAppointmentsPage from './health-care-manage-benefits/schedule-view-va-appointments-page';
import createSecureMessagingPage from './health-care-manage-benefits/secure-messaging-page';
import createViewTestAndLabResultsPage from './health-care-manage-benefits/view-test-and-lab-results-page';

// No-react styles.
import './sass/static-pages.scss';

// Social share links behavior
import './social-share-links';

// Resources and support widgets
import createResourcesAndSupportSearchWidget from './resources-and-support-search';

// Health care facility widgets
import createFacilityListWidget from './facilities/facilityList';
import createBasicFacilityListWidget from './facilities/basicFacilityList';
import facilityReducer from './facilities/reducers';
import createOtherFacilityListWidget from './facilities/otherFacilityList';
import createChapter36CTA from './vre-chapter36/createChapter36CTA';
import createChapter31CTA from './vre-chapter31/createChapter31CTA';
import createViewDependentsCTA from './view-modify-dependents/view-dependents-cta/createViewDependentsCTA';
import createViewPaymentHistoryCTA from './view-payment-history/createViewPaymentHistoryCTA';

// School resources widgets
import {
  createScoEventsWidget,
  createScoAnnouncementsWidget,
} from './school-resources/SchoolResources';
import createCoronavirusChatbot from '../coronavirus-chatbot/createCoronavirusChatbot';
import createCovidVaccineUpdatesWidget from './covid-vaccine-updates-cta/createCovidVaccineUpdatesWidget';

import createThirdPartyApps, {
  thirdPartyAppsReducer,
} from '../third-party-app-directory/createThirdPartyApps';
import initTranslation from './translation';

import createDependencyVerification from './dependency-verification/createDependencyVerification';
import dependencyVerificationReducer from './dependency-verification/reducers/index';

// Set the app name header when using the apiRequest helper
window.appName = 'static-pages';

// Set further errors to have the appropriate source tag
Sentry.configureScope(scope => scope.setTag('source', 'static-pages'));

const store = createCommonStore({
  ...facilityReducer,
  ...findVaFormsWidgetReducer,
  ...post911GIBillStatusReducer,
  ...thirdPartyAppsReducer,
  ...dependencyVerificationReducer,
});

Sentry.withScope(scope => {
  scope.setTag('source', 'site-wide');
  startSitewideComponents(store);
});

subscribeAdditionalInfoEvents();

subscribeAccordionEvents();

subscribeComponentAnalyticsEvents();

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

createResourcesAndSupportSearchWidget(
  store,
  widgetTypes.RESOURCES_AND_SUPPORT_SEARCH,
);

createFacilityListWidget();
createOtherFacilityListWidget();
createFacilityPage(store);
createBasicFacilityListWidget();

createScoEventsWidget();
createScoAnnouncementsWidget();

// App Directory third party applications widget
createThirdPartyApps(store, widgetTypes.THIRD_PARTY_APP_DIRECTORY);

createFindVaForms(store, widgetTypes.FIND_VA_FORMS);
createFindVaFormsInvalidPdfAlert(
  store,
  widgetTypes.FIND_VA_FORMS_INVALID_PDF_ALERT,
);
createPost911GiBillStatusWidget(
  store,
  widgetTypes.POST_911_GI_BILL_STATUS_WIDGET,
);

createCoronavirusChatbot(store, widgetTypes.CORONAVIRUS_CHATBOT);
createCovidVaccineUpdatesWidget(store, widgetTypes.COVID_VACCINE_UPDATES_CTA);

createViewDependentsCTA(store, widgetTypes.VIEW_DEPENDENTS_CTA);
form686CTA(store, widgetTypes.FORM_686_CTA);

// Create Health Care | Manage Benefits widgets.
createGetMedicalRecordsPage(store, widgetTypes.GET_MEDICAL_RECORDS_PAGE);
createRefillTrackPrescriptionsPage(
  store,
  widgetTypes.REFILL_TRACK_PRESCRIPTIONS_PAGE,
);
createScheduleViewVAAppointmentsPage(
  store,
  widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE,
);
createSecureMessagingPage(store, widgetTypes.SECURE_MESSAGING_PAGE);
createViewTestAndLabResultsPage(
  store,
  widgetTypes.VIEW_TEST_AND_LAB_RESULTS_PAGE,
);

createChapter36CTA(store, widgetTypes.CHAPTER_36_CTA);
createChapter31CTA(store, widgetTypes.CHAPTER_31_CTA);
createViewPaymentHistoryCTA(store, widgetTypes.VIEW_PAYMENT_HISTORY);

createDependencyVerification(store, widgetTypes.DEPENDENCY_VERIFICATION);

// homepage widgets
if (location.pathname === '/') {
  createMyVALoginWidget(store);
}

// translation link
initTranslation();

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
