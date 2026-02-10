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

/*
 * Toggle true for local development
 */
export const useStagingDataLocally = true;

const baseUrl =
  useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
    ? 'https://staging-api.va.gov'
    : environment.API_URL;

let endpoints = {
  fetchVSOReps: '/services/veteran/v0/vso_accredited_representatives',
  fetchOtherReps: '/services/veteran/v0/other_accredited_representatives',
  flagReps: '/representation_management/v0/flag_accredited_representatives',
};

export const getEndpointOptions = () => endpoints;

export const setRepSearchEndpointsFromFlag = enabled => {
  if (enabled) {
    endpoints = {
      ...endpoints,
      fetchVSOReps: '/representation_management/v0/accredited_individuals',
      fetchOtherReps: '/representation_management/v0/accredited_individuals',
    };
  } else {
    endpoints = {
      ...endpoints,
      fetchVSOReps: '/services/veteran/v0/vso_accredited_representatives',
      fetchOtherReps: '/services/veteran/v0/other_accredited_representatives',
    };
  }
};

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
    address ? `address=${encodeURIComponent(address)}` : null,
    lat ? `lat=${encodeURIComponent(lat)}` : null,
    long ? `long=${encodeURIComponent(long)}` : null,
    name ? `name=${encodeURIComponent(name)}` : null,
    `page=${encodeURIComponent(page) || 1}`,
    `per_page=${encodeURIComponent(perPage)}`,
    `sort=${encodeURIComponent(sort)}`,
    `type=${encodeURIComponent(type)}`,
    distance ? `distance=${encodeURIComponent(distance)}` : null,
  ];

  return `?${compact([...params]).join('&')}`;
};

export const representativeTypes = {
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'veteran_service_officer',
  [RepresentativeType.ATTORNEY]: 'attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'claim_agents',
};
