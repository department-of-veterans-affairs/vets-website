import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const useStagingDataLocally = true;

const baseUrl =
  useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
    ? `https://staging-api.va.gov`
    : `${environment.API_URL}`;

const isLocalOrStaging =
  (useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001') ||
  new URL(baseUrl).host === 'staging-api.va.gov';

export const REPRESENTATIVES_API = () => {
  // When we were testing with isCypressTest, this value needs to be set to the legacy endpoint.
  // At the time of writing the Accreditation API had no data for VSO Representatives.
  const isCypressTest = typeof Cypress !== 'undefined';
  if (isCypressTest) return '/representation_management/v0/original_entities';

  if (isLocalOrStaging)
    return '/representation_management/v0/accredited_entities_for_appoint'; // Accreditation API data endpoint
  return '/representation_management/v0/original_entities';
};

export const NEXT_STEPS_EMAIL_API =
  '/representation_management/v0/next_steps_email';

export const REPRESENTATIVE_STATUS_API =
  '/representation_management/v0/power_of_attorney';
