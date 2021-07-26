// Relative imports.
import backendServices from 'platform/user/profile/constants/backendServices';
import { MHV_ACCOUNT_TYPES } from './constants';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { rootUrl as addRemoveDependentsUrl } from 'applications/disability-benefits/686c-674/manifest.json';
import { rootUrl as hearingAidSuppliesUrl } from 'applications/disability-benefits/2346/manifest.json';
import { rootUrl as viewDependentsUrl } from 'applications/personalization/view-dependents/manifest.json';
import { rootUrl as viewPaymentHistoryUrl } from 'applications/disability-benefits/view-payments/manifest.json';

export const ctaWidgetsLookup = {
  ADD_REMOVE_DEPENDENTS: {
    id: 'add-remove-dependents',
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
  CHANGE_ADDRESS: {
    id: 'change-address',
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
  CLAIMS_AND_APPEALS: {
    id: 'claims-and-appeals',
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
  DIRECT_DEPOSIT: {
    id: 'direct-deposit',
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
  DISABILITY_BENEFITS: {
    id: 'disability-benefits',
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
  DISABILITY_RATINGS: {
    id: 'disability-ratings',
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
  GI_BILL_BENEFITS: {
    id: 'gi-bill-benefits',
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
  HEALTH_RECORDS: {
    id: 'health-records',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'download-my-data'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'VA Blue Button',
    requiredServices: backendServices.HEALTH_RECORDS,
    serviceDescription: 'view your VA medical records',
  },
  HEARING_AID_SUPPLIES: {
    id: 'hearing-aid-supplies',
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
  LAB_AND_TEST_RESULTS: {
    id: 'lab-and-test-results',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'labs-tests'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'Lab and Test Results',
    requiredServices: null,
    serviceDescription: 'view your lab and test results',
  },
  LETTERS: {
    id: 'letters',
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
  MANAGE_VA_DEBT: {
    id: 'manage-va-debt',
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
  MESSAGING: {
    id: 'messaging',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'Secure Messaging',
    requiredServices: backendServices.MESSAGING,
    serviceDescription: 'send secure messages',
  },
  RX: {
    id: 'rx',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(
        'web/myhealthevet/refill-prescriptions',
        authenticatedWithSSOe,
      ),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.slice(0, 2).includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'Prescription Refill and Tracking',
    requiredServices: backendServices.RX,
    serviceDescription: 'refill prescriptions',
  },
  SCHEDULE_APPOINTMENTS: {
    id: 'schedule-appointments',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
  },
  VETERAN_ID_CARD: {
    id: 'vic',
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
  VET_TEC: {
    id: 'vet-tec',
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
  VIEW_APPOINTMENTS: {
    id: 'view-appointments',
    deriveToolUrlDetails: authenticatedWithSSOe => ({
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    }),
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
  },
  VIEW_DEPENDENTS: {
    id: 'view-dependents',
    deriveToolUrlDetails: () => ({ url: viewDependentsUrl, redirect: false }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view current dependents',
  },
  VIEW_PAYMENT_HISTORY: {
    id: 'view-payment-history',
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
  VRRAP: {
    id: 'vrrap',
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
