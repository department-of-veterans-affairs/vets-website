// Node modules.
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import * as Sentry from '@sentry/browser';
// Relative imports.
import './analytics';
import './sass/static-pages.scss';
import 'platform/polyfills';
import alertsBuildShow from './widget-creators/alerts-dismiss-view';
import form686CTA from './view-modify-dependent/686-cta/form686CTA';
import icsCreate from './widget-creators/ics-generator';
import openShareLink from './widget-creators/social-share-links';
import startSitewideComponents from 'platform/site-wide';
import subscribeAccordionEvents from './subscription-creators/subscribeAccordionEvents';
import subscribeAdditionalInfoEvents from './subscription-creators/subscribeAdditionalInfoEvents';
import widgetTypes from './widgetTypes';
import { VA_FORM_IDS } from 'platform/forms/constants';
// Health Care | Manage Benefits widgets.
import createGetMedicalRecordsPage from './health-care-manage-benefits/get-medical-records-page';
import createRefillTrackPrescriptionsPage from './health-care-manage-benefits/refill-track-prescriptions-page';
import createScheduleViewVAAppointmentsPage from './health-care-manage-benefits/schedule-view-va-appointments-page';
import createSecureMessagingPage from './health-care-manage-benefits/secure-messaging-page';
import createViewTestAndLabResultsPage from './health-care-manage-benefits/view-test-and-lab-results-page';
// Health care facility widgets.
import createBasicFacilityListWidget from './facilities/basicFacilityList';
import createChapter31CTA from './vre-chapter31/createChapter31CTA';
import createChapter36CTA from './vre-chapter36/createChapter36CTA';
import createFacilityListWidget from './facilities/facilityList';
import createI18Select from './i18Select/createI18Select';
import createOtherFacilityListWidget from './facilities/otherFacilityList';
import createViewDependentsCTA from './view-modify-dependents/view-dependents-cta/createViewDependentsCTA';
import createViewPaymentHistoryCTA from './view-payment-history/createViewPaymentHistoryCTA';
import facilityReducer from './facilities/reducers';
// Other widgets.
import createAskVAWidget from './ask-va';
import createApplicationStatus from './widget-creators/createApplicationStatus';
import createCOEAccess from './coe-access/createCOEAccess';
import createCallToActionWidget from './widget-creators/createCallToActionWidget';
import createCommonStore from 'platform/startup/store';
import createCoronavirusChatbot from '../coronavirus-chatbot/createCoronavirusChatbot';
import createCovidVaccineUpdatesWidget from './covid-vaccine-updates-cta/createCovidVaccineUpdatesWidget';
import createDependencyVerification from './dependency-verification/createDependencyVerification';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createDisabilityRatingCalculator from '../disability-benefits/disability-rating-calculator/createCalculator';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createEventsPage from './events';
import createExpandableOperatingStatus from './facilities/vet-center/createExpandableOperatingStatus';
import createFacilityPage from './facilities/createFacilityPage';
import createFindVaForms, {
  findVaFormsWidgetReducer,
} from '../find-forms/createFindVaForms';
import createFindVaFormsPDFDownloadHelper from '../find-forms/widgets/createFindVaFormsPDFDownloadHelper';
import createHigherLevelReviewApplicationStatus from 'applications/disability-benefits/996/components/createHLRApplicationStatus';
import createManageVADebtCTA from './manage-va-debt/createManageVADebtCTA';
import createMedicalCopaysCTA from './medical-copays-cta';
import createMyVALoginWidget from './widget-creators/createMyVALoginWidget';
import createNearByVetCenters from './facilities/vet-center/createNearByVetCenters';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import createPost911GiBillStatusWidget, {
  post911GIBillStatusReducer,
} from '../post-911-gib-status/createPost911GiBillStatusWidget';
import createResourcesAndSupportSearchWidget from './widget-creators/resources-and-support-search';
import createThirdPartyApps, {
  thirdPartyAppsReducer,
} from '../third-party-app-directory/createThirdPartyApps';
import createVetCentersHours from './facilities/createVetCentersHours';
import createVetCentersHoursOne from './facilities/createVetCentersHoursOne';
import createVetCentersHoursTwo from './facilities/createVetCentersHoursTwo';
import createVetCentersHoursThree from './facilities/createVetCentersHoursThree';
import dependencyVerificationReducer from './dependency-verification/reducers/index';
import {
  createScoEventsWidget,
  createScoAnnouncementsWidget,
} from './school-resources/SchoolResources';

// Set the app name header when using the apiRequest helper
window.appName = 'static-pages';

// Set errors to have the appropriate source tag.
Sentry.configureScope(scope => scope.setTag('source', 'static-pages'));

// Create the Redux store.
const store = createCommonStore({
  ...facilityReducer,
  ...findVaFormsWidgetReducer,
  ...post911GIBillStatusReducer,
  ...thirdPartyAppsReducer,
  ...dependencyVerificationReducer,
});

// Add the site-wide source tag to the sentry scope.
Sentry.withScope(scope => {
  scope.setTag('source', 'site-wide');
  startSitewideComponents(store);
});

// Before create-widget tasks.
subscribeAdditionalInfoEvents();
subscribeAccordionEvents();
alertsBuildShow();
icsCreate();
openShareLink();

// Create widgets.
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
createVetCentersHours(store);
createVetCentersHoursOne(store);
createVetCentersHoursTwo(store);
createVetCentersHoursThree(store);
createExpandableOperatingStatus(store);
createNearByVetCenters(store);
createFacilityListWidget();
createOtherFacilityListWidget();
createFacilityPage(store);
createBasicFacilityListWidget();
createScoEventsWidget();
createScoAnnouncementsWidget();
createThirdPartyApps(store, widgetTypes.THIRD_PARTY_APP_DIRECTORY);
createFindVaForms(store, widgetTypes.FIND_VA_FORMS);
createFindVaFormsPDFDownloadHelper(
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
createAskVAWidget(store, widgetTypes.ASK_VA);
createEventsPage(store, widgetTypes.EVENTS);
createMedicalCopaysCTA(store, widgetTypes.MEDICAL_COPAYS_CTA);
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
createI18Select(store, widgetTypes.I_18_SELECT);
createDependencyVerification(store, widgetTypes.DEPENDENCY_VERIFICATION);
createCOEAccess(store, widgetTypes.COE_ACCESS);
createManageVADebtCTA(store, widgetTypes.MANAGE_VA_DEBT_CTA);

// Create the My VA Login widget only on the homepage.
if (location.pathname === '/') {
  createMyVALoginWidget(store);
}

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
