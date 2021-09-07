// Relative imports.
import backendServices from 'platform/user/profile/constants/backendServices';
import { MHV_ACCOUNT_TYPES } from './constants';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { rootUrl as addRemoveDependentsUrl } from 'applications/disability-benefits/686c-674/manifest.json';
import { rootUrl as hearingAidSuppliesUrl } from 'applications/disability-benefits/2346/manifest.json';
import { rootUrl as higherLevelReviewUrl } from 'applications/disability-benefits/996/manifest.json';
import { rootUrl as viewDependentsUrl } from 'applications/personalization/view-dependents/manifest.json';
import { rootUrl as viewPaymentHistoryUrl } from 'applications/disability-benefits/view-payments/manifest.json';

export const CTA_WIDGET_TYPES = {
  ADD_REMOVE_DEPENDENTS: 'add-remove-dependents',
  CHANGE_ADDRESS: 'change-address',
  CLAIMS_AND_APPEALS: 'claims-and-appeals',
  DIRECT_DEPOSIT: 'direct-deposit',
  DISABILITY_BENEFITS: 'disability-benefits',
  DISABILITY_RATINGS: 'disability-ratings',
  GI_BILL_BENEFITS: 'gi-bill-benefits',
  HEALTH_RECORDS: 'health-records',
  HEARING_AID_SUPPLIES: 'hearing-aid-supplies',
  HIGHER_LEVEL_REVIEW: 'higher-level-review',
  LAB_AND_TEST_RESULTS: 'lab-and-test-results',
  LETTERS: 'letters',
  MANAGE_VA_DEBT: 'manage-va-debt',
  MESSAGING: 'messaging',
  RX: 'rx',
  SCHEDULE_APPOINTMENTS: 'schedule-appointments',
  VETERAN_ID_CARD: 'vic',
  VET_TEC: 'vet-tec',
  VIEW_APPOINTMENTS: 'view-appointments',
  VIEW_DEPENDENTS: 'view-dependents',
  VIEW_PAYMENT_HISTORY: 'view-payment-history',
  VRRAP: 'vrrap',
};

export const ctaWidgetsLookup = {
  [CTA_WIDGET_TYPES.ADD_REMOVE_DEPENDENTS]: {
    id: CTA_WIDGET_TYPES.ADD_REMOVE_DEPENDENTS,
    deriveToolUrlDetails: () => ({
      url: addRemoveDependentsUrl,
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'add or remove dependents',
  },
  [CTA_WIDGET_TYPES.CHANGE_ADDRESS]: {
    id: CTA_WIDGET_TYPES.CHANGE_ADDRESS,
    deriveToolUrlDetails: () => ({
      url: '/profile/personal-information',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'change your address',
  },
  [CTA_WIDGET_TYPES.CLAIMS_AND_APPEALS]: {
    id: CTA_WIDGET_TYPES.CLAIMS_AND_APPEALS,
    deriveToolUrlDetails: () => ({ url: '/track-claims/', redirect: true }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: [
      backendServices.EVSS_CLAIMS,
      backendServices.APPEALS_STATUS,
    ],
    serviceDescription: 'see your claim or appeal status',
  },
  [CTA_WIDGET_TYPES.DIRECT_DEPOSIT]: {
    id: CTA_WIDGET_TYPES.DIRECT_DEPOSIT,
    deriveToolUrlDetails: () => ({
      url: '/profile/direct-deposit',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'change your direct deposit information online',
  },
  [CTA_WIDGET_TYPES.DISABILITY_BENEFITS]: {
    id: CTA_WIDGET_TYPES.DISABILITY_BENEFITS,
    deriveToolUrlDetails: () => ({
      url: '/disability/how-to-file-claim',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'file for disability benefits',
  },
  [CTA_WIDGET_TYPES.DISABILITY_RATINGS]: {
    id: CTA_WIDGET_TYPES.DISABILITY_RATINGS,
    deriveToolUrlDetails: () => ({
      url: '/disability/view-disability-rating/rating',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA disability rating',
  },
  [CTA_WIDGET_TYPES.GI_BILL_BENEFITS]: {
    id: CTA_WIDGET_TYPES.GI_BILL_BENEFITS,
    deriveToolUrlDetails: () => ({
      url: '/education/gi-bill/post-9-11/ch-33-benefit/status',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'check your GI Bill Benefits',
  },
  [CTA_WIDGET_TYPES.HEALTH_RECORDS]: {
    id: CTA_WIDGET_TYPES.HEALTH_RECORDS,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'download-my-data'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: true,
    mhvToolName: 'VA Blue Button',
    requiredServices: backendServices.HEALTH_RECORDS,
    serviceDescription: 'view your VA medical records',
  },
  [CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES]: {
    id: CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES,
    deriveToolUrlDetails: () => ({
      url: hearingAidSuppliesUrl,
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'order hearing aid supplies',
  },
  [CTA_WIDGET_TYPES.HIGHER_LEVEL_REVIEW]: {
    id: CTA_WIDGET_TYPES.HIGHER_LEVEL_REVIEW,
    deriveToolUrlDetails: () => ({
      url: higherLevelReviewUrl,
      redirect: false,
    }),
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'request a Higher-Level Review',
  },
  [CTA_WIDGET_TYPES.LAB_AND_TEST_RESULTS]: {
    id: CTA_WIDGET_TYPES.LAB_AND_TEST_RESULTS,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'labs-tests'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: true,
    mhvToolName: 'Lab and Test Results',
    requiredServices: null,
    serviceDescription: 'view your lab and test results',
  },
  [CTA_WIDGET_TYPES.LETTERS]: {
    id: CTA_WIDGET_TYPES.LETTERS,
    deriveToolUrlDetails: () => ({
      url: '/records/download-va-letters/letters',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'get your VA benefit letters',
  },
  [CTA_WIDGET_TYPES.MANAGE_VA_DEBT]: {
    id: CTA_WIDGET_TYPES.MANAGE_VA_DEBT,
    deriveToolUrlDetails: () => ({
      url: '/manage-va-debt/your-debt',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'manage your VA debt',
  },
  [CTA_WIDGET_TYPES.MESSAGING]: {
    id: CTA_WIDGET_TYPES.MESSAGING,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: true,
    mhvToolName: 'Secure Messaging',
    requiredServices: backendServices.MESSAGING,
    serviceDescription: 'send secure messages',
  },
  [CTA_WIDGET_TYPES.RX]: {
    id: CTA_WIDGET_TYPES.RX,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(
        authenticatedWithSSOe,
        'web/myhealthevet/refill-prescriptions',
      ),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.slice(0, 2).includes(accountLevel),
    isHealthTool: true,
    mhvToolName: 'Prescription Refill and Tracking',
    requiredServices: backendServices.RX,
    serviceDescription: 'refill prescriptions',
  },
  [CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS]: {
    id: CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: true,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
  },
  [CTA_WIDGET_TYPES.VETERAN_ID_CARD]: {
    id: CTA_WIDGET_TYPES.VETERAN_ID_CARD,
    deriveToolUrlDetails: () => ({
      url: '/records/get-veteran-id-cards/apply',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.ID_CARD,
    serviceDescription: 'apply for a Veteran ID Card',
  },
  [CTA_WIDGET_TYPES.VET_TEC]: {
    id: CTA_WIDGET_TYPES.VET_TEC,
    deriveToolUrlDetails: () => ({
      url:
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EDUCATION_BENEFITS,
    serviceDescription: 'apply for VET TEC',
  },
  [CTA_WIDGET_TYPES.VIEW_APPOINTMENTS]: {
    id: CTA_WIDGET_TYPES.VIEW_APPOINTMENTS,
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: true,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
  },
  [CTA_WIDGET_TYPES.VIEW_DEPENDENTS]: {
    id: CTA_WIDGET_TYPES.VIEW_DEPENDENTS,
    deriveToolUrlDetails: () => ({ url: viewDependentsUrl, redirect: false }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view current dependents',
  },
  [CTA_WIDGET_TYPES.VIEW_PAYMENT_HISTORY]: {
    id: CTA_WIDGET_TYPES.VIEW_PAYMENT_HISTORY,
    deriveToolUrlDetails: () => ({
      url: viewPaymentHistoryUrl,
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA payment history',
  },
  [CTA_WIDGET_TYPES.VRRAP]: {
    id: CTA_WIDGET_TYPES.VRRAP,
    deriveToolUrlDetails: () => ({
      url:
        'education/other-va-education-benefits/veteran-rapid-retraining-assistance/apply-for-vrrap-form-22-1990s',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EDUCATION_BENEFITS,
    serviceDescription: 'apply for VRRAP',
  },
};
