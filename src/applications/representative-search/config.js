import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import compact from 'lodash/compact';
import { RepresentativeType } from './constants';
import manifest from './manifest.json';

/* eslint-disable camelcase */

export const sortOptions = {
  distance_asc: 'Distance (closest to farthest)',
  first_name_asc: 'First name (A - Z)',
  first_name_desc: 'First name (Z - A)',
  last_name_asc: 'Last name (A - Z)',
  last_name_desc: 'Last name (Z - A)',
};

export const searchAreaOptions = {
  '5': '5 miles',
  '10': '10 miles',
  '25': '25 miles',
  '50': '50 miles',
  '100': '100 miles',
  '200': '200 miles',
  'Show all': 'Show all',
};
const appUrl = new URL(environment.BASE_URL);
const apiUrl = new URL(environment.API_URL);

const LOCAL_HOST = 'localhost:3001';
const STAGING_HOST = 'staging-api.va.gov';

const isLocal = appUrl.host === LOCAL_HOST;
const isStaging = apiUrl.host === STAGING_HOST;

const baseUrl = isLocal ? `https://${STAGING_HOST}` : apiUrl.origin; // We use .origin here to have no trailing slash
const isLocalOrStaging = isLocal || isStaging;

export const endpointOptions = () => {
  // When we were testing with isCypressTest, this value needs to be set to the legacy endpoint.
  // At the time of writing the Accreditation API had no data for VSO Representatives.
  const isCypressTest = typeof Cypress !== 'undefined';
  if (isCypressTest)
    return {
      fetchVSOReps: `/services/veteran/v0/vso_accredited_representatives`, // Legacy endpoint
      fetchOtherReps: `/services/veteran/v0/other_accredited_representatives`, // Legacy endpoint
      flagReps: `/representation_management/v0/flag_accredited_representatives`, // Legacy endpoint
    };

  return {
    fetchVSOReps: isLocalOrStaging
      ? `/representation_management/v0/accredited_individuals` // Accreditation API data endpoint
      : `/services/veteran/v0/vso_accredited_representatives`, // Legacy endpoint

    fetchOtherReps: isLocalOrStaging
      ? `/representation_management/v0/accredited_individuals` // Accreditation API data endpoint
      : `/services/veteran/v0/other_accredited_representatives`, // Legacy endpoint
    flagReps: `/representation_management/v0/flag_accredited_representatives`, // Legacy endpoint
  };
};

/*
 * Toggle true for local development
 */

export const formatReportBody = newReport => {
  const reportRequestBody = {
    representative_id: newReport.representativeId,
    flags: [],
  };

  for (const [flag_type, flagged_value] of Object.entries(newReport.reports)) {
    if (flagged_value !== null) {
      reportRequestBody.flags.push({
        // convert 'phone' to snakecase 'phone_number' before pushing
        flag_type: flag_type === 'phone' ? 'phone_number' : flag_type,
        flagged_value,
      });
    }
  }

  return reportRequestBody;
};

/**
 * Build requestUrl and settings for api calls
 *  * @param endpoint {String} eg '/vso_accredited_representatives'
 *  * @param method {String} 'GET' or 'POST' (optional - defaults to 'GET')
 *  * @param requestBody {String} optional
 * @returns {requestUrl, apiSettings}
 */
export const getApi = (endpoint, method = 'GET', requestBody) => {
  const requestUrl = `${baseUrl}${endpoint}`;

  const csrfToken = localStorage.getItem('csrfToken');

  let formattedReportBody;

  if (method === 'POST') {
    formattedReportBody = formatReportBody(requestBody);
  }

  const apiSettings = {
    mode: 'cors',
    method,

    headers: {
      'X-Key-Inflection': 'camel',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,

      // Pull app name directly from manifest since this config is defined
      // before startApp, and using window.appName here would result in
      // undefined for all requests that use this config.
      'Source-App-Name': manifest.entryName,
    },
    body: JSON.stringify(formattedReportBody) || null,
  };

  return { requestUrl, apiSettings };
};

/**
 * Build parameters and URL for representative API calls
 *
 */
export const resolveParamsWithUrl = ({
  address,
  lat,
  long,
  name,
  page,
  perPage = 10,
  sort,
  type = 'veteran_service_officer',
  distance,
}) => {
  const params = [
    address ? `address=${address}` : null,
    lat ? `lat=${lat}` : null,
    long ? `long=${long}` : null,
    name ? `name=${name}` : null,
    `page=${page || 1}`,
    `per_page=${perPage}`,
    `sort=${sort}`,
    `type=${type}`,
    distance ? `distance=${distance}` : null,
  ];

  return `?${compact([...params]).join('&')}`;
};

export const representativeTypes = {
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'veteran_service_officer',
  [RepresentativeType.ATTORNEY]: 'attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'claim_agents',
};
