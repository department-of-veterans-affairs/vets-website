import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const useStagingDataLocally = true;

const baseUrl =
  useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
    ? `https://staging-api.va.gov`
    : `${environment.API_URL}`;

const isLocalOrStaging =
  (useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001') ||
  baseUrl.includes('staging-api.va.gov');

export const REPRESENTATIVES_API = isLocalOrStaging
  ? '/representation_management/v0/accredited_entities_for_appoint' // Accreditation API data endpoint
  : '/representation_management/v0/original_entities';

export const NEXT_STEPS_EMAIL_API =
  '/representation_management/v0/next_steps_email';

export const REPRESENTATIVE_STATUS_API =
  '/representation_management/v0/power_of_attorney';
