import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import compact from 'lodash/compact';
import { RepresentativeType } from './constants';
import manifest from './manifest.json';

/* eslint-disable camelcase */

export const sortOptions = {
  distance_asc: 'Distance (closest to farthest)',
  first_name_asc: 'First Name (A - Z)',
  first_name_desc: 'First Name (Z - A)',
  last_name_asc: 'Last Name (A - Z)',
  last_name_desc: 'Last Name (Z - A)',
};

/*
 * Toggle true for local development
 */
export const useStagingDataLocally = true;

const baseUrl =
  useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
    ? `https://staging-api.va.gov/services/veteran/v0`
    : `${environment.API_URL}/services/veteran/v0`;

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
    body: JSON.stringify(requestBody) || null,
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
  ];

  return `?${compact([...params]).join('&')}`;
};

export const representativeTypes = {
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'veteran_service_officer',
  [RepresentativeType.ATTORNEY]: 'attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'claim_agents',
};
