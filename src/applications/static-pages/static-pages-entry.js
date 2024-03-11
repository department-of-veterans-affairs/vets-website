// Node modules.
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import * as Sentry from '@sentry/browser';
// Relative imports.
import './analytics';
import 'platform/polyfills';
import startSitewideComponents from 'platform/site-wide';
import { VA_FORM_IDS } from 'platform/forms/constants';
import createCommonStore from 'platform/startup/store';
import showVaAlertExpandable from 'platform/site-wide/alerts/showVaAlertExpandable';
import alertsBuildShow from './widget-creators/alerts-dismiss-view';
import form686CTA from './view-modify-dependent/686-cta/form686CTA';
import { icsCreate } from './widget-creators/ics-generator';
import openShareLink from './widget-creators/social-share-links';
import subscribeAccordionEvents from './subscription-creators/subscribeAccordionEvents';
import subscribeAdditionalInfoEvents from './subscription-creators/subscribeAdditionalInfoEvents';
import widgetTypes from './widgetTypes';
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
import createBTSSSLogin from './BTSSS-login/createBTSSSLogin';
import createCOEAccess from './coe-access/createCOEAccess';
import createCallToActionWidget from './widget-creators/createCallToActionWidget';
import createDependencyVerification from './dependency-verification/createDependencyVerification';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createDisabilityRatingCalculator from '../disability-benefits/disability-rating-calculator/createCalculator';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createEventsPage from './events';
import createExpandableOperatingStatus from './facilities/vet-center/createExpandableOperatingStatus';
import createEZRSubmissionOptions from './ezr-submission-options';
import createEZRTeraAlert from './ezr-tera-alert';
import createFacilityPage from './facilities/createFacilityPage';
import createFacilityMapSatelliteMainOffice from './facilities/createFacilityMapSatelliteMainOffice';
import createFacilityPageSatelliteLocations from './facilities/createFacilityPageSatelliteLocations';
import createFindARepLandingContent from './representative-search';
import createFindVaForms, {
  findVaFormsWidgetReducer,
} from '../find-forms/createFindVaForms';
import createFindVaFormsPDFDownloadHelper from '../find-forms/widgets/createFindVaFormsPDFDownloadHelper';
import createHCAPerformanceWarning from './hca-performance-warning';
import createManageVADebtCTA from './manage-va-debt/createManageVADebtCTA';
import createMedicalCopaysCTA from './medical-copays-cta';
import createMyVALoginWidget from './widget-creators/createMyVALoginWidget';
import createNearByVetCenters from './facilities/vet-center/createNearByVetCenters';
import createNodCTA from './nod-cta';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import createPost911GiBillStatusWidget, {
  post911GIBillStatusReducer,
} from '../post-911-gib-status/createPost911GiBillStatusWidget';
import createResourcesAndSupportSearchWidget from './widget-creators/resources-and-support-search';
import createShiftedVetsBanner from './shifted-vets-banner';
import createSupplementalClaim from './supplemental-claim';
import createThirdPartyApps, {
  thirdPartyAppsReducer,
} from '../third-party-app-directory/createThirdPartyApps';
import createVetCentersHours from './facilities/createVetCentersHours';
import createVetCentersSatelliteLocationHours from './facilities/createVetCentersSatelliteLocationHours';
import dependencyVerificationReducer from './dependency-verification/reducers/index';
import {
  createScoEventsWidget,
  createScoAnnouncementsWidget,
} from './school-resources/SchoolResources';
import createHomepageHeroRandomizer from './homepage-veteran-banner';
import createHomepageSearch from './homepage/createHomepageSearch';
import create1095BDownloadCTA from './download-1095b';

import createEnrollmentVerificationLoginWidget from './view-enrollment-verification-login/createEnrollmentVerificationLoginWidget';
import createEducationLettersLoginWidget from './view-education-letters-login/createEducationLettersLoginWidget';
import create2010206Access from './simple-forms/20-10206/entry';
import create210845Access from './simple-forms/21-0845/entry';
import create210966Access from './simple-forms/21-0966/entry';
import create210972Access from './simple-forms/21-0972/entry';
import create2110210Access from './simple-forms/21-10210/entry';
import create214142Access from './simple-forms/21-4142/entry';
import create21P0847Access from './simple-forms/21P-0847/entry';
import create264555Access from './simple-forms/26-4555/entry';
import create400247Access from './simple-forms/40-0247/entry';
import createBurialHowDoIApplyWidget from './burial-how-do-i-apply-widget';
import createPensionApp from './pension-how-do-i-apply-widget';
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
// See `content-build/src/site/includes/social-share.drupal.liquid
// & `content-build/src/site/layouts/event.drupal.liquid`, respectively (per selector)
icsCreate('#add-to-calendar-link, a.recurring-event');
openShareLink();
showVaAlertExpandable(store);

// Create widgets.
createPensionApp(store, widgetTypes.PENSION_APP_STATUS);

createApplicationStatus(store, {
  formId: VA_FORM_IDS.FORM_10_10EZ,
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyLink: '/health-care/how-to-apply/',
  applyText: 'Apply for health care benefits',
  widgetType: widgetTypes.HEALTH_CARE_APP_STATUS,
});
createBTSSSLogin(store);
createCallToActionWidget(store, widgetTypes.CTA);
createEducationApplicationStatus(store, widgetTypes.EDUCATION_APP_STATUS);
createOptOutApplicationStatus(store, widgetTypes.OPT_OUT_APP_STATUS);
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
createVetCentersSatelliteLocationHours(store);
createExpandableOperatingStatus(store);
createNearByVetCenters(store);
createFacilityListWidget();
createOtherFacilityListWidget();
createFacilityPage(store);
createFacilityMapSatelliteMainOffice(store);
createFacilityPageSatelliteLocations(store);
createBasicFacilityListWidget();
createScoEventsWidget();
createScoAnnouncementsWidget();
createThirdPartyApps(store, widgetTypes.THIRD_PARTY_APP_DIRECTORY);
createFindARepLandingContent(store, widgetTypes.FIND_A_REP_LANDING_CONTENT);
createFindVaForms(store, widgetTypes.FIND_VA_FORMS);
createFindVaFormsPDFDownloadHelper(
  store,
  widgetTypes.FIND_VA_FORMS_INVALID_PDF_ALERT,
);
createPost911GiBillStatusWidget(
  store,
  widgetTypes.POST_911_GI_BILL_STATUS_WIDGET,
);
createViewDependentsCTA(store, widgetTypes.VIEW_DEPENDENTS_CTA);
form686CTA(store, widgetTypes.FORM_686_CTA);
createAskVAWidget(store, widgetTypes.ASK_VA);
createEventsPage(store, widgetTypes.EVENTS);
createEZRSubmissionOptions(store, widgetTypes.EZR_SUBMISSION_OPTIONS);
createEZRTeraAlert(store, widgetTypes.EZR_TERA_ALERT);
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
createHCAPerformanceWarning(store, widgetTypes.HCA_PERFORMANCE_WARNING);
createManageVADebtCTA(store, widgetTypes.MANAGE_VA_DEBT_CTA);
createHomepageHeroRandomizer(store, widgetTypes.HOMEPAGE_HERO_RANDOMIZER);
createHomepageSearch(store, widgetTypes.HOMEPAGE_SEARCH);
create1095BDownloadCTA(store, widgetTypes.DOWNLOAD_1095B_CTA);
createShiftedVetsBanner(store);
createNodCTA(store, widgetTypes.FORM_10182_CTA);
createSupplementalClaim(store, widgetTypes.SUPPLEMENTAL_CLAIM);
createEnrollmentVerificationLoginWidget(
  store,
  widgetTypes.VIEW_ENROLLMENT_VERIFICATION_LOGIN,
);
createEducationLettersLoginWidget(
  store,
  widgetTypes.VIEW_EDUCATION_LETTERS_LOGIN,
);
create2010206Access(store, widgetTypes.FORM_2010206_CTA);
create210845Access(store, widgetTypes.FORM_210845_CTA);
create210966Access(store, widgetTypes.FORM_210966_CTA);
create210972Access(store, widgetTypes.FORM_210972_CTA);
create2110210Access(store, widgetTypes.FORM_2110210_CTA);
create214142Access(store, widgetTypes.FORM_214142_CTA);
create21P0847Access(store, widgetTypes.FORM_21P0847_CTA);
create264555Access(store, widgetTypes.FORM_264555_CTA);
create400247Access(store, widgetTypes.FORM_400247_CTA);
createBurialHowDoIApplyWidget(store, widgetTypes.BURIAL_HOW_DO_I_APPLY_WIDGET);

// Create the My VA Login widget only on the homepage.
if (window.location.pathname === '/') {
  createMyVALoginWidget(store);
}

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
