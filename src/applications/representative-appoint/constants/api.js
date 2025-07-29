import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const apiUrl = new URL(environment.API_URL);
const baseUrl = new URL(environment.BASE_URL);
const ALLOWED_HOSTS = ['localhost:3001', 'staging-api.va.gov'];
const isLocalOrStaging = [baseUrl.host, apiUrl.host].some(host =>
  ALLOWED_HOSTS.includes(host),
);

export const REPRESENTATIVES_API = () => {
  // When we were testing with isCypressTest, this value needs to be set to the legacy endpoint.
  // At the time of writing the Accreditation API had no data for VSO Representatives.
  const isCypressTest = typeof Cypress !== 'undefined';
  if (isCypressTest) return '/representation_management/v0/original_entities';

  if (isLocalOrStaging)
    return '/representation_management/v0/accredited_entities_for_appoint'; // Accreditation API data endpoint
  return '/representation_management/v0/original_entities'; // Legacy endpoint
};

export const NEXT_STEPS_EMAIL_API =
  '/representation_management/v0/next_steps_email';

export const REPRESENTATIVE_STATUS_API =
  '/representation_management/v0/power_of_attorney';
