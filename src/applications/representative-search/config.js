import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import compact from 'lodash/compact';
import { RepresentativeType } from './constants';
import manifest from './manifest.json';
// import { facilityLocatorLatLongOnly } from './utils/featureFlagSelectors';

/* eslint-disable camelcase */

const apiSettings = {
  // credentials: 'include',
  mode: 'cors',
  headers: {
    'X-Key-Inflection': 'camel',
    'Sec-Fetch-Mode': 'cors',

    // Pull app name directly from manifest since this config is defined
    // before startApp, and using window.appName here would result in
    // undefined for all requests that use this config.
    'Source-App-Name': manifest.entryName,
  },
};

export const sortOptions = {
  distance_asc: 'Distance (closest to farthest)',
  // distance_desc: 'Distance (farthest to closest)',
  first_name_asc: 'First Name (A - Z)',
  first_name_desc: 'First Name (Z - A)',
  last_name_asc: 'Last Name (A - Z)',
  last_name_desc: 'Last Name (Z - A)',
};

/*
 * Toggle true for local development
 */
export const useStagingDataLocally = true;

export const claimsAgentIsEnabled = false;

export const getAPI = repType => {
  return {
    baseUrl:
      useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
        ? `https://staging-api.va.gov/services/veteran/v0/${
            repType === 'officer' ? 'vso' : 'other'
          }_accredited_representatives`
        : `${environment.API_URL}/services/veteran/v0/${
            repType === 'officer' ? 'vso' : 'other'
          }_accredited_representatives`,
    url:
      useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
        ? `https://staging-api.va.gov/services/veteran/v0/${
            repType === 'officer' ? 'vso' : 'other'
          }_accredited_representatives`
        : `${environment.API_URL}/services/veteran/v0/${
            repType === 'officer' ? 'vso' : 'other'
          }_accredited_representatives`,
    settings: apiSettings,
  };
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
  type = 'officer',
}) => {
  const api = getAPI(type);

  const { url } = api;

  const params = [
    address ? `address=${address}` : null,
    lat ? `lat=${lat}` : null,
    long ? `long=${long}` : null,
    name ? `name=${name}` : null,
    `page=${page || 1}`,
    `per_page=${perPage}`,
    `sort=${sort}`,
    type ? `type=${type}` : null,
  ];

  return {
    url,
    params: compact([...params]).join('&'),
  };
};
// Please use sentence case for all of these
// except 'Vet Centers' and acronyms like IDES.

export const representativeTypes = {
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'Claims agent',
};

export const representativeTypesOptions = {
  [RepresentativeType.NONE]: '',
  [RepresentativeType.VETERAN_SERVICE_OFFICER]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'Claims agent',
};
