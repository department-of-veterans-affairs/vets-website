// Node modules.
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import * as Sentry from '@sentry/browser';
// Relative imports.
import './analytics';
import 'platform/polyfills';
import startSitewideComponents from 'platform/site-wide';
import { VA_FORM_IDS } from 'platform/forms/constants';
import createCommonStore from 'platform/startup/store';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import widgetTypes from 'platform/site-wide/widgetTypes';
import createRepresentativeStatus from 'platform/user/widgets/representative-status';
import alertsBuildShow from './widget-creators/alerts-dismiss-view';
import form686CTA from './view-modify-dependent/686-cta/form686CTA';
import { icsCreate } from './widget-creators/ics-generator';
import openShareLink from './widget-creators/social-share-links';
// Health Care | Manage Benefits widgets.
import createModernGetMedicalRecordsPage from './health-care-manage-benefits/modern-get-medical-records-page';
import createModernRefillTrackPrescriptionsPage from './health-care-manage-benefits/modern-refill-track-prescriptions-page';
import createModernScheduleViewVAAppointmentsPage from './health-care-manage-benefits/modern-schedule-view-va-appointments-page';
import createModernSecureMessagingPage from './health-care-manage-benefits/modern-secure-messaging-page';
import createModernOrderMedicalSuppliesPage from './health-care-manage-benefits/modern-order-medical-supplies-page';
import createMhvPortalLandingPage from './health-care-manage-benefits/mhv-portal-landing-page';
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
import createAskVAWidget from './ask-va-widget';
import createApplicationStatus from './widget-creators/createApplicationStatus';
import createBTSSSLogin from './BTSSS-login/createBTSSSLogin';
import createCOEAccess from './coe-access/createCOEAccess';
import createCallToActionWidget from './widget-creators/createCallToActionWidget';
import createDependencyVerification from './dependency-verification/createDependencyVerification';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createDisabilityRatingCalculator from '../disability-benefits/disability-rating-calculator/createCalculator';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createEventsPage from './events';
import createEZRSubmissionOptions from './ezr-submission-options';
import createFacilityPage from './facilities/createFacilityPage';
import createFacilityMapSatelliteMainOffice from './facilities/createFacilityMapSatelliteMainOffice';
import createFacilityPageSatelliteLocations from './facilities/createFacilityPageSatelliteLocations';
import createFindARepLandingContent from './representative-search';
import createAppointARepLandingContent from './representative-appoint';
import {
  createFindVaForms,
  reducer as findVAFormsReducer,
} from './find-forms/createFindVaForms';
import createFindVaFormsPDFDownloadHelper from './find-forms/download-widget';
import createHCAPerformanceWarning from './hca-performance-warning';
import createHomepageEmailSignup from './homepage-email-signup';
import createManageVADebtCTA from './manage-va-debt/createManageVADebtCTA';
import createMedicalCopaysCTA from './medical-copays-cta';
import createMyVALoginWidget from './widget-creators/createMyVALoginWidget';
import createNearByVetCenters from './facilities/vet-center/createNearByVetCenters';
import createNearByVALocations from './facilities/vet-center/createNearByVALocations';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';
import createPost911GiBillStatusWidget, {
  post911GIBillStatusReducer,
} from '../post-911-gib-status/createPost911GiBillStatusWidget';
import createResourcesAndSupportSearchWidget from './widget-creators/resources-and-support-search';
import createSituationUpdatesBanner from './situation-updates-banner/createSituationUpdatesBanner';
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
import create2010207Access from './simple-forms/20-10207/entry';
import create210845Access from './simple-forms/21-0845/entry';
import create210966Access from './simple-forms/21-0966/entry';
import create210972Access from './simple-forms/21-0972/entry';
import create2110210Access from './simple-forms/21-10210/entry';
import create214138Access from './simple-forms/21-4138/entry';
import create214140Access from './simple-forms/21-4140/entry';
import create214142Access from './simple-forms/21-4142/entry';
import create21P0537Access from './simple-forms/21P-0537/entry';
import create21P601Access from './simple-forms/21P-601/entry';
import create21P0847Access from './simple-forms/21P-0847/entry';
import create264555Access from './simple-forms/26-4555/entry';
import create210779Access from './benefits-optimization-aquia/21-0779/entry';
import create212680Access from './benefits-optimization-aquia/21-2680/entry';
import create214192Access from './benefits-optimization-aquia/21-4192/entry';
import create400247Access from './simple-forms/40-0247/entry';
import createFormUploadAccess from './simple-forms/form-upload/entry';
import createBurialHowDoIApplyWidget from './burial-how-do-i-apply-widget';
import createPensionApp from './pension-how-do-i-apply-widget';
import create21P0969Access from './income-and-asset';
import createVYEEnrollmentWidget from './vye-enrollment-login-widget/createVYEEnrollmentWidget';

import create1010DExtendedAccess from './ivc-champva/10-10d-extended/entry';
import create107959CAccess from './ivc-champva/10-7959c/entry';
import create107959AAccess from './ivc-champva/10-7959a/entry';
import create107959F2Access from './ivc-champva/10-7959f-2/entry';
import create21P8416Access from './medical-expense-report/entry';

import './mhv-signin-cta/sass/mhv-signin-cta.scss';
import createMhvSigninCallToAction from './mhv-signin-cta/createMhvSigninCTA';
import createDependentsVerificationHowToVerify from './dependents-verification';

import create21P534ezAccess from './survivors-benefits/entry';

// Set the app name header when using the apiRequest helper
window.appName = 'static-pages';

// Set errors to have the appropriate source tag.
Sentry.configureScope(scope => scope.setTag('source', 'static-pages'));

// Create the Redux store.
const store = createCommonStore({
  ...facilityReducer,
  ...findVAFormsReducer,
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
alertsBuildShow();
// See `content-build/src/site/includes/social-share.drupal.liquid
// & `content-build/src/site/layouts/event.drupal.liquid`, respectively (per selector)
icsCreate('#add-to-calendar-link, a.recurring-event');
openShareLink();
connectFeatureToggle(store.dispatch);

// Create widgets.
createPensionApp(store, widgetTypes.PENSION_APP_STATUS);
create21P0969Access(store, widgetTypes.INCOME_AND_ASSET_STATEMENT_STAGED_ENTRY);

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
createNearByVetCenters(store);
createNearByVALocations(store);
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
createAppointARepLandingContent(
  store,
  widgetTypes.APPOINT_A_REP_LANDING_CONTENT,
);
createRepresentativeStatus(store, widgetTypes.REPRESENTATIVE_STATUS);
createFindVaForms(store, widgetTypes.FIND_VA_FORMS);
createFindVaFormsPDFDownloadHelper(
  store,
  widgetTypes.FIND_VA_FORMS_DOWNLOAD_MODAL,
);
createHomepageEmailSignup(store, widgetTypes.HOMEPAGE_EMAIL_SIGNUP);
createPost911GiBillStatusWidget(
  store,
  widgetTypes.POST_911_GI_BILL_STATUS_WIDGET,
);
createViewDependentsCTA(store, widgetTypes.VIEW_DEPENDENTS_CTA);
form686CTA(store, widgetTypes.FORM_686_CTA);
createAskVAWidget(store, widgetTypes.ASK_VA);
createEventsPage(store, widgetTypes.EVENTS);
createEZRSubmissionOptions(store, widgetTypes.EZR_SUBMISSION_OPTIONS);
createMedicalCopaysCTA(store, widgetTypes.MEDICAL_COPAYS_CTA);
createModernGetMedicalRecordsPage(
  store,
  widgetTypes.MODERN_GET_MEDICAL_RECORDS_PAGE,
);
createModernRefillTrackPrescriptionsPage(
  store,
  widgetTypes.MODERN_REFILL_TRACK_PRESCRIPTIONS_PAGE,
);
createModernScheduleViewVAAppointmentsPage(
  store,
  widgetTypes.MODERN_SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE,
);
createModernSecureMessagingPage(
  store,
  widgetTypes.MODERN_SECURE_MESSAGING_PAGE,
);
createModernOrderMedicalSuppliesPage(
  store,
  widgetTypes.MODERN_ORDER_MEDICAL_SUPPLIES_PAGE,
);
createMhvPortalLandingPage(store, widgetTypes.MHV_PORTAL_LANDING_PAGE);
createSituationUpdatesBanner(store, widgetTypes.SITUATION_UPDATES_BANNER);
createChapter36CTA(store, widgetTypes.CHAPTER_36_CTA);
createChapter31CTA(store, widgetTypes.CHAPTER_31_CTA);
createViewPaymentHistoryCTA(store, widgetTypes.VIEW_PAYMENT_HISTORY);
createI18Select(store, widgetTypes.I_18_SELECT);
createDependencyVerification(store, widgetTypes.DEPENDENCY_VERIFICATION);
createDependentsVerificationHowToVerify(
  store,
  widgetTypes.DEPENDENTS_VERIFICATION_HOW_TO_VERIFY,
);
createCOEAccess(store, widgetTypes.COE_ACCESS);
createHCAPerformanceWarning(store, widgetTypes.HCA_PERFORMANCE_WARNING);
createManageVADebtCTA(store, widgetTypes.MANAGE_VA_DEBT_CTA);
// Second instance is for another widget type on the same page
createManageVADebtCTA(store, widgetTypes.DISPUTE_DEBT_LINK);
createHomepageHeroRandomizer(store, widgetTypes.HOMEPAGE_HERO_RANDOMIZER); // And this
createHomepageSearch(store, widgetTypes.HOMEPAGE_SEARCH); // And this
create1095BDownloadCTA(store, widgetTypes.DOWNLOAD_1095B_CTA);
createEnrollmentVerificationLoginWidget(
  store,
  widgetTypes.VIEW_ENROLLMENT_VERIFICATION_LOGIN,
);
createEducationLettersLoginWidget(
  store,
  widgetTypes.VIEW_EDUCATION_LETTERS_LOGIN,
);
create2010206Access(store, widgetTypes.FORM_2010206_CTA);
create2010207Access(store, widgetTypes.FORM_2010207_CTA);
create210845Access(store, widgetTypes.FORM_210845_CTA);
create210966Access(store, widgetTypes.FORM_210966_CTA);
create210972Access(store, widgetTypes.FORM_210972_CTA);
create2110210Access(store, widgetTypes.FORM_2110210_CTA);
create214138Access(store, widgetTypes.FORM_214138_CTA);
create214140Access(store, widgetTypes.EMPLOYMENT_QUESTIONNAIRE);
create214142Access(store, widgetTypes.FORM_214142_CTA);
create21P0537Access(store, widgetTypes.FORM_21P0537_CTA);
create21P601Access(store, widgetTypes.FORM_21P601_CTA);
create21P0847Access(store, widgetTypes.FORM_21P0847_CTA);
create264555Access(store, widgetTypes.FORM_264555_CTA);
create210779Access(store, widgetTypes.FORM_210779_CTA);
create212680Access(store, widgetTypes.FORM_212680_CTA);
create214192Access(store, widgetTypes.FORM_214192_CTA);
create400247Access(store, widgetTypes.FORM_400247_CTA);
createBurialHowDoIApplyWidget(store, widgetTypes.BURIAL_HOW_DO_I_APPLY_WIDGET);
createVYEEnrollmentWidget(store, widgetTypes.VYE_ENROLLMENT_LOGIN_WIDGET);
createFormUploadAccess(store, widgetTypes.FORM_UPLOAD);

create1010DExtendedAccess(store, widgetTypes.FORM_1010D_EXTENDED);
create107959CAccess(store, widgetTypes.FORM_107959C);
create107959AAccess(store, widgetTypes.FORM_107959A);
create107959F2Access(store, widgetTypes.FORM_107959F2);
createMhvSigninCallToAction(store, widgetTypes.MHV_SIGNIN_CTA);
create21P8416Access(store, widgetTypes.MEDICAL_EXPENSE_REPORT);

create21P534ezAccess(store, widgetTypes.SURVIVORS_BENEFITS);

// Create the My VA Login widget only on the homepage.
if (window.location.pathname === '/') {
  createMyVALoginWidget(store); // We might only need this one for the homepage
}

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
