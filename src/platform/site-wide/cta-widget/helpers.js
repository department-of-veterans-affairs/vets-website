import backendServices from 'platform/user/profile/constants/backendServices';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { hasSessionSSO } from 'platform/user/profile/utilities';

/**
 * These are the valid values for the Widget Type field in the Drupal CMS when
 * embedding a Call To Action React Widget in a static page
 */
export const widgetTypes = {
  CLAIMS_AND_APPEALS: 'claims-and-appeals',
  DIRECT_DEPOSIT: 'direct-deposit',
  DISABILITY_BENEFITS: 'disability-benefits',
  DISABILITY_RATINGS: 'disability-ratings',
  GI_BILL_BENEFITS: 'gi-bill-benefits',
  HEALTH_RECORDS: 'health-records',
  LAB_AND_TEST_RESULTS: 'lab-and-test-results',
  LETTERS: 'letters',
  MESSAGING: 'messaging',
  RX: 'rx',
  SCHEDULE_APPOINTMENTS: 'schedule-appointments',
  VET_TEC: 'vet-tec',
  VETERAN_ID_CARD: 'vic',
  VIEW_APPOINTMENTS: 'view-appointments',
};

const HEALTH_TOOLS = [
  widgetTypes.HEALTH_RECORDS,
  widgetTypes.LAB_AND_TEST_RESULTS,
  widgetTypes.MESSAGING,
  widgetTypes.RX,
  widgetTypes.SCHEDULE_APPOINTMENTS,
  widgetTypes.VIEW_APPOINTMENTS,
];

const MHV_ACCOUNT_TYPES = ['Premium', 'Advanced', 'Basic'];

export const hasRequiredMhvAccount = (appId, accountLevel) => {
  switch (appId) {
    case widgetTypes.HEALTH_RECORDS:
    case widgetTypes.LAB_AND_TEST_RESULTS:
      return MHV_ACCOUNT_TYPES.includes(accountLevel);
    case widgetTypes.RX:
      return MHV_ACCOUNT_TYPES.slice(0, 2).includes(accountLevel);
    case widgetTypes.MESSAGING:
    case widgetTypes.SCHEDULE_APPOINTMENTS:
    case widgetTypes.VIEW_APPOINTMENTS:
      return accountLevel === 'Premium';
    default:
      // Not a recognized health tool.
      return false;
  }
};

export const isHealthTool = appId => HEALTH_TOOLS.includes(appId);

export const mhvToolName = appId => {
  switch (appId) {
    case widgetTypes.HEALTH_RECORDS:
      return 'VA Blue Button';

    case widgetTypes.RX:
      return 'Prescription Refill and Tracking';

    case widgetTypes.MESSAGING:
      return 'Secure Messaging';

    case widgetTypes.LAB_AND_TEST_RESULTS:
      return 'Lab and Test Results';

    case widgetTypes.SCHEDULE_APPOINTMENTS:
    case widgetTypes.VIEW_APPOINTMENTS:
      return 'VA Appointments';

    default: // Not a recognized health tool.
  }

  return null;
};

export const toolUrl = appId => {
  switch (appId) {
    case widgetTypes.HEALTH_RECORDS:
      return {
        url: mhvUrl(hasSessionSSO(), 'download-my-data'),
        redirect: false,
      };

    case widgetTypes.RX:
      return {
        url: mhvUrl(hasSessionSSO(), 'web/myhealthevet/refill-prescriptions'),
        redirect: true,
      };

    case widgetTypes.MESSAGING:
      return {
        url: mhvUrl(hasSessionSSO(), 'secure-messaging'),
        redirect: true,
      };

    case widgetTypes.VIEW_APPOINTMENTS:
    case widgetTypes.SCHEDULE_APPOINTMENTS:
      return {
        url: mhvUrl(hasSessionSSO(), 'appointments'),
        redirect: false,
      };

    case widgetTypes.LAB_AND_TEST_RESULTS:
      return {
        url: mhvUrl(hasSessionSSO(), 'labs-tests'),
        redirect: true,
      };

    case widgetTypes.CLAIMS_AND_APPEALS:
      return {
        url: '/track-claims/',
        redirect: true,
      };

    case widgetTypes.GI_BILL_BENEFITS:
      return {
        url: '/education/gi-bill/post-9-11/ch-33-benefit/status',
        redirect: false,
      };

    case widgetTypes.DISABILITY_BENEFITS:
      return {
        url: '/disability/how-to-file-claim',
        redirect: false,
      };

    case widgetTypes.LETTERS:
      return {
        url: '/records/download-va-letters/letters',
        redirect: false,
      };

    case widgetTypes.VETERAN_ID_CARD:
      return {
        url: '/records/get-veteran-id-cards/apply',
        redirect: false,
      };

    case widgetTypes.VET_TEC:
      return {
        url:
          '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
        redirect: false,
      };

    case widgetTypes.DIRECT_DEPOSIT:
      return {
        url: '/profile',
        redirect: false,
      };

    case widgetTypes.DISABILITY_RATINGS:
      return {
        url: '/disability/view-disability-rating/rating',
        redirect: false,
      };

    default:
      return {};
  }
};

// Map frontend apps to their required services.
// Note: frontend apps and backend services don't necessarily map one-to-one.
// For example, some apps might require the same backend services.
// Some apps might also require access to multiple backend services.

export const requiredServices = appId => {
  switch (appId) {
    case widgetTypes.HEALTH_RECORDS:
      return backendServices.HEALTH_RECORDS;

    case widgetTypes.RX:
      return backendServices.RX;

    case widgetTypes.MESSAGING:
      return backendServices.MESSAGING;

    case widgetTypes.LAB_AND_TEST_RESULTS:
    case widgetTypes.VIEW_APPOINTMENTS:
    case widgetTypes.SCHEDULE_APPOINTMENTS:
      return null;

    case widgetTypes.GI_BILL_BENEFITS:
    case widgetTypes.DISABILITY_BENEFITS:
    case widgetTypes.LETTERS:
      return backendServices.EVSS_CLAIMS;

    case widgetTypes.CLAIMS_AND_APPEALS:
      return [backendServices.EVSS_CLAIMS, backendServices.APPEALS_STATUS];

    case widgetTypes.VETERAN_ID_CARD:
      return backendServices.ID_CARD;

    case widgetTypes.VET_TEC:
      return backendServices.EDUCATION_BENEFITS;

    default:
      return null;
  }
};

export const serviceDescription = appId => {
  switch (appId) {
    case widgetTypes.HEALTH_RECORDS:
      return 'view your VA medical records';

    case widgetTypes.RX:
      return 'refill prescriptions';

    case widgetTypes.MESSAGING:
      return 'send secure messages';

    case widgetTypes.LAB_AND_TEST_RESULTS:
      return 'view your lab and test results';

    case widgetTypes.VIEW_APPOINTMENTS:
      return 'view, schedule, or cancel your appointment online';

    case widgetTypes.SCHEDULE_APPOINTMENTS:
      return 'view, schedule, or cancel your appointment online';

    case widgetTypes.GI_BILL_BENEFITS:
      return 'check your GI Bill Benefits';

    case widgetTypes.DISABILITY_BENEFITS:
      return 'file for disability benefits';

    case widgetTypes.CLAIMS_AND_APPEALS:
      return 'see your claim or appeal status';

    case widgetTypes.LETTERS:
      return 'get your VA benefit letters';

    case widgetTypes.VETERAN_ID_CARD:
      return 'apply for a Veteran ID Card';

    case widgetTypes.VET_TEC:
      return 'apply for VET TEC';

    case widgetTypes.DIRECT_DEPOSIT:
      return 'change your direct deposit information online';

    case widgetTypes.DISABILITY_RATINGS:
      return 'view your VA disability rating';

    default:
      return 'use this service';
  }
};
