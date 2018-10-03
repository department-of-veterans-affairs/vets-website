import backendServices from '../../user/profile/constants/backendServices';

// Map frontend apps to their required services.
// Note: frontend apps and backend services don't necessarily map one-to-one.
// For example, some apps might require the same backend services.
// Some apps might also require access to multiple backend services.

export const frontendApps = {
  HEALTH_RECORDS: 'health-records',
  RX: 'rx',
  MESSAGING: 'messaging',
  LAB_AND_TEST_RESULTS: 'lab-and-test-results',
  APPOINTMENTS: 'appointments',
  GI_BILL_BENEFITS: 'gi-bill-benefits',
  DISABILITY_BENEFITS: 'disability-benefits',
  CLAIMS_AND_APPEALS: 'claims-and-appeals',
  LETTERS: 'letters',
  VETERAN_ID_CARD: 'vic',
};

const mhvBaseUrl = () => {
  const lowerEnvironments = [
    'development',
    'vagovdev',
    'staging',
    'vagovstaging',
  ];

  const mhvSubdomain = lowerEnvironments.includes(__BUILDTYPE__)
    ? 'mhv-intb'
    : 'www';

  return `https://${mhvSubdomain}.myhealth.va.gov`;
};

export const redirectUrl = contentUrl => {
  switch (contentUrl) {
    case '/health-care/secure-messaging/':
      return `${mhvBaseUrl()}/mhv-portal-web/secure-messaging`;

    case '/health-care/refill-track-prescriptions/':
      return `${mhvBaseUrl()}/mhv-portal-web/web/myhealthevet/refill-prescriptions`;

    case '/health-care/get-medical-records/':
      return `${mhvBaseUrl()}/mhv-portal-web/download-my-data`;

    case '/health-care/schedule-view-va-appointments/':
      return `${mhvBaseUrl()}/mhv-portal-web/web/myhealthevet/scheduling-a-va-appointment`;

    case '/health-care/view-test-and-lab-results/':
      return `${mhvBaseUrl()}/mhv-portal-web/labs-tests`;

    case '/claim-or-appeal-status/':
      return '/track-claims/';

    default:
      return null;
  }
};

export const requiredServices = appId => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return backendServices.HEALTH_RECORDS;

    case frontendApps.RX:
      return backendServices.RX;

    case frontendApps.MESSAGING:
      return backendServices.MESSAGING;

    case frontendApps.LAB_AND_TEST_RESULTS:
    case frontendApps.APPOINTMENTS:
      return null;

    case frontendApps.GI_BILL_BENEFITS:
    case frontendApps.DISABILITY_BENEFITS:
    case frontendApps.LETTERS:
      return backendServices.EVSS_CLAIMS;

    case frontendApps.CLAIMS_AND_APPEALS:
      return [backendServices.EVSS_CLAIMS, backendServices.APPEALS_STATUS];

    case frontendApps.VETERAN_ID_CARD:
      return backendServices.ID_CARD;

    default:
      return null;
  }
};

export const serviceDescription = appId => {
  switch (appId) {
    case frontendApps.HEALTH_RECORDS:
      return 'use VA Blue Button';

    case frontendApps.RX:
      return 'refill VA prescriptions online.';

    case frontendApps.MESSAGING:
      return 'send secure messages to your health care team';

    case frontendApps.LAB_AND_TEST_RESULTS:
      return 'view your VA lab and test results online.';

    case frontendApps.APPOINTMENTS:
      return ['schedule appointments online', 'view appointments online'];

    default:
      return 'use this service';
  }
};
