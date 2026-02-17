// Relative imports.
import backendServices from '~/platform/user/profile/constants/backendServices';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { getAppUrl } from '~/platform/utilities/registry-helpers';

export const viewDependentsUrl = getAppUrl('dependents-view-dependents');

export const disabilityBenefitsUrls = {
  '686c': getAppUrl('686C-674-v2'),
  'view-payments': getAppUrl('view-payments'),
};

export const CTA_WIDGET_TYPES = {
  ADD_REMOVE_DEPENDENTS: 'add-remove-dependents',
  CHANGE_ADDRESS: 'change-address',
  CLAIMS_AND_APPEALS: 'claims-and-appeals',
  COMBINED_DEBT_PORTAL: 'combined-debt-portal',
  DIRECT_DEPOSIT: 'direct-deposit',
  DISABILITY_BENEFITS: 'disability-benefits',
  DISABILITY_RATINGS: 'disability-ratings',
  EDUCATION_LETTERS: 'education-letters',
  ENROLLMENT_VERIFICATION: 'enrollment-verification',
  GI_BILL_BENEFITS: 'gi-bill-benefits',
  HA_CPAP_SUPPLIES: 'ha-cpap-supplies',
  HEARING_AID_SUPPLIES: 'hearing-aid-supplies',
  HOME_LOAN_COE_STATUS: 'home-loan-coe-status',
  LETTERS: 'letters',
  MANAGE_VA_DEBT: 'manage-va-debt',
  SCHEDULE_APPOINTMENTS: 'schedule-appointments',
  UPDATE_HEALTH_BENEFITS_INFO: 'update-health-benefits-info',
  VETERAN_ID_CARD: 'vic',
  VET_TEC: 'vet-tec',
  VIEW_DEPENDENTS: 'view-dependents',
  VIEW_PAYMENT_HISTORY: 'view-payment-history',
};

export const ctaWidgetsLookup = {
  [CTA_WIDGET_TYPES.ADD_REMOVE_DEPENDENTS]: {
    id: CTA_WIDGET_TYPES.ADD_REMOVE_DEPENDENTS,
    deriveToolUrlDetails: () => ({
      url: disabilityBenefitsUrls['686c'],
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
      url: '/profile/contact-information',
      redirect: true,
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
    headerLevel: 2,
    mhvToolName: null,
    requiredServices: [
      backendServices.EVSS_CLAIMS,
      backendServices.APPEALS_STATUS,
    ],
    serviceDescription: 'check your claim, decision review, or appeal status',
  },
  [CTA_WIDGET_TYPES.COMBINED_DEBT_PORTAL]: {
    id: CTA_WIDGET_TYPES.COMBINED_DEBT_PORTAL,
    deriveToolUrlDetails: () => ({
      url: '/manage-va-debt/summary',
      redirect: true,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'manage your VA debt',
  },
  [CTA_WIDGET_TYPES.DIRECT_DEPOSIT]: {
    id: CTA_WIDGET_TYPES.DIRECT_DEPOSIT,
    deriveToolUrlDetails: () => ({
      url: '/profile/direct-deposit',
      redirect: true,
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
    headerLevel: 2,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA disability rating',
  },
  [CTA_WIDGET_TYPES.EDUCATION_LETTERS]: {
    id: CTA_WIDGET_TYPES.EDUCATION_LETTERS,
    deriveToolUrlDetails: () => ({
      url: 'education/download-letters',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'check your VA education letter',
  },
  [CTA_WIDGET_TYPES.ENROLLMENT_VERIFICATION]: {
    id: CTA_WIDGET_TYPES.ENROLLMENT_VERIFICATION,
    deriveToolUrlDetails: () => ({
      url: 'education/verify-school-enrollment',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'verify your school enrollment',
  },
  [CTA_WIDGET_TYPES.GI_BILL_BENEFITS]: {
    id: CTA_WIDGET_TYPES.GI_BILL_BENEFITS,
    deriveToolUrlDetails: () => ({
      url: '/education/check-remaining-post-9-11-gi-bill-benefits/status',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EVSS_CLAIMS,
    serviceDescription: 'check your GI Bill benefits',
  },
  [CTA_WIDGET_TYPES.HA_CPAP_SUPPLIES]: {
    id: CTA_WIDGET_TYPES.HA_CPAP_SUPPLIES,
    deriveToolUrlDetails: () => ({
      url: '/health-care/order-hearing-aid-or-CPAP-supplies-form',
      redirect: true,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'order hearing aid and CPAP supplies',
    featureToggle: featureFlagNames.haCpapSuppliesCta,
  },
  // CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES should be removed
  [CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES]: {
    id: CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES,
    deriveToolUrlDetails: () => ({
      url: '/health-care/order-hearing-aid-or-CPAP-supplies-form',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'order hearing aid supplies',
  },
  [CTA_WIDGET_TYPES.HOME_LOAN_COE_STATUS]: {
    id: CTA_WIDGET_TYPES.HOME_LOAN_COE_STATUS,
    deriveToolUrlDetails: () => ({
      url: '/housing-assistance/home-loans/check-coe-status/your-coe/',
      redirect: true,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    headerLevel: 2,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'check the status of your COE',
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
      url: '/manage-va-debt/summary/debt-balances',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'manage your VA debt',
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
  [CTA_WIDGET_TYPES.UPDATE_HEALTH_BENEFITS_INFO]: {
    id: CTA_WIDGET_TYPES.UPDATE_HEALTH_BENEFITS_INFO,
    deriveToolUrlDetails: () => ({
      url: '/my-health/update-benefits-information-form-10-10ezr',
      redirect: true,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'update your health benefits information',
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
      url: '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    mhvToolName: null,
    requiredServices: backendServices.EDUCATION_BENEFITS,
    serviceDescription: 'apply for VET TEC',
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
      url: disabilityBenefitsUrls['view-payments'],
      redirect: false,
    }),
    hasRequiredMhvAccount: () => false,
    isHealthTool: false,
    headerLevel: 2,
    mhvToolName: null,
    requiredServices: null,
    serviceDescription: 'view your VA payment history',
  },
};
