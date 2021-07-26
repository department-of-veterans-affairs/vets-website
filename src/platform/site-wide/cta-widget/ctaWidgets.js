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
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'add or remove dependents',
    toolUrl: { url: addRemoveDependentsUrl, redirect: false },
  },
  CHANGE_ADDRESS: {
    id: 'change-address',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'change your address',
    toolUrl: { url: '/profile/personal-information', redirect: false },
  },
  CLAIMS_AND_APPEALS: {
    id: 'claims-and-appeals',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: [
      backendServices.EVSS_CLAIMS,
      backendServices.APPEALS_STATUS,
    ],
    serviceDescription: 'see your claim or appeal status',
    toolUrl: { url: '/track-claims/', redirect: true },
  },
  DIRECT_DEPOSIT: {
    id: 'direct-deposit',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'change your direct deposit information online',
    toolUrl: { url: '/profile/direct-deposit', redirect: false },
  },
  DISABILITY_BENEFITS: {
    id: 'disability-benefits',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'file for disability benefits',
    toolUrl: { url: '/disability/how-to-file-claim', redirect: false },
  },
  DISABILITY_RATINGS: {
    id: 'disability-ratings',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA disability rating',
    toolUrl: {
      url: '/disability/view-disability-rating/rating',
      redirect: false,
    },
  },
  GI_BILL_BENEFITS: {
    id: 'gi-bill-benefits',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'check your GI Bill Benefits',
    toolUrl: {
      url: '/education/gi-bill/post-9-11/ch-33-benefit/status',
      redirect: false,
    },
  },
  HEALTH_RECORDS: {
    id: 'health-records',
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'VA Blue Button',
    requiredServices: backendServices.HEALTH_RECORDS,
    serviceDescription: 'view your VA medical records',
    toolUrl: {
      url: mhvUrl(authenticatedWithSSOe, 'download-my-data'),
      redirect: false,
    },
  },
  HEARING_AID_SUPPLIES: {
    id: 'hearing-aid-supplies',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'order hearing aid supplies',
    toolUrl: { url: hearingAidSuppliesUrl, redirect: false },
  },
  LAB_AND_TEST_RESULTS: {
    id: 'lab-and-test-results',
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'Lab and Test Results',
    requiredServices: null,
    serviceDescription: 'view your lab and test results',
    toolUrl: {
      url: mhvUrl(authenticatedWithSSOe, 'labs-tests'),
      redirect: false,
    },
  },
  LETTERS: {
    id: 'letters',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'get your VA benefit letters',
    toolUrl: { url: '/records/download-va-letters/letters', redirect: false },
  },
  MANAGE_VA_DEBT: {
    id: 'manage-va-debt',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'manage your VA debt',
    toolUrl: { url: '/manage-va-debt/your-debt', redirect: false },
  },
  MESSAGING: {
    id: 'messaging',
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'Secure Messaging',
    requiredServices: backendServices.MESSAGING,
    serviceDescription: 'send secure messages',
    toolUrl: {
      url: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
      redirect: false,
    },
  },
  RX: {
    id: 'rx',
    hasRequiredMhvAccount: accountLevel =>
      MHV_ACCOUNT_TYPES.slice(0, 2).includes(accountLevel),
    isHealthTool: false,
    mhvToolName: 'Prescription Refill and Tracking',
    requiredServices: backendServices.RX,
    serviceDescription: 'refill prescriptions',
    toolUrl: {
      url: mhvUrl(
        authenticatedWithSSOe,
        'web/myhealthevet/refill-prescriptions',
      ),
      redirect: false,
    },
  },
  SCHEDULE_APPOINTMENTS: {
    id: 'schedule-appointments',
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
    toolUrl: {
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    },
  },
  VETERAN_ID_CARD: {
    id: 'vic',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.ID_CARD,
    serviceDescription: 'apply for a Veteran ID Card',
    toolUrl: { url: '/records/get-veteran-id-cards/apply', redirect: false },
  },
  VET_TEC: {
    id: 'vet-tec',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EDUCATION_BENEFITS,
    serviceDescription: 'apply for VET TEC',
    toolUrl: {
      url:
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
      redirect: false,
    },
  },
  VIEW_APPOINTMENTS: {
    id: 'view-appointments',
    hasRequiredMhvAccount: accountLevel => accountLevel === 'Premium',
    isHealthTool: false,
    mhvToolName: 'VA Appointments',
    requiredServices: null,
    serviceDescription: 'view, schedule, or cancel your appointment online',
    toolUrl: {
      url: mhvUrl(authenticatedWithSSOe, 'appointments'),
      redirect: false,
    },
  },
  VIEW_DEPENDENTS: {
    id: 'view-dependents',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view current dependents',
    toolUrl: { url: viewDependentsUrl, redirect: false },
  },
  VIEW_PAYMENT_HISTORY: {
    id: 'view-payment-history',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA payment history',
    toolUrl: { url: viewPaymentHistoryUrl, redirect: false },
  },
  VRRAP: {
    id: 'vrrap',
    hasRequiredMhvAccount: accountLevel => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EDUCATION_BENEFITS,
    serviceDescription: 'apply for VRRAP',
    toolUrl: {
      url:
        'education/other-va-education-benefits/veteran-rapid-retraining-assistance/apply-for-vrrap-form-22-1990s',
      redirect: false,
    },
  },
};
