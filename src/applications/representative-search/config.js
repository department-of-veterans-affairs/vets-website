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

export const orgSortOptions = {
  distance_asc: 'Distance (closest to farthest)',
  distance_desc: 'Distance (farthest to closest)',
  name_asc: 'Name (A - Z)',
  name_desc: 'Name (Z - A)',
};

/*
 * Toggle true for local development
 */
export const useStagingDataLocally = true;

export const claimsAgentIsEnabled = false;

const railsEngineApi = {
  baseUrl:
    useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov/services/veteran/v0/accredited_representatives`
      : `${environment.API_URL}/services/veteran/v0/accredited_representatives`,
  url:
    useStagingDataLocally && environment.BASE_URL === 'http://localhost:3001'
      ? `https://staging-api.va.gov/services/veteran/v0/accredited_representatives`
      : `${environment.API_URL}/services/veteran/v0/accredited_representatives`,
  settings: apiSettings,
};

export const getAPI = () => railsEngineApi;

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
  type = 'organization',
}) => {
  const api = getAPI();

  const { url } = api;

  let newSort = sort;

  /* 
    Converting sort type for scenarios where the rep type is 
    updated in a way that's doesn't correspond with the current sort type
  */

  if (type !== 'organization') {
    if (sort === 'name_asc') {
      newSort = 'last_name_asc';
    } else if (sort === 'name_desc') {
      newSort = 'last_name_desc';
    }
  } else if (type === 'organization') {
    if (sort === 'last_name_asc') {
      newSort = 'name_asc';
    } else if (sort === 'last_name_desc') {
      newSort = 'name_desc';
    }
  }

  const params = [
    address ? `address=${address}` : null,
    lat ? `lat=${lat}` : null,
    long ? `long=${long}` : null,
    name ? `name=${name}` : null,
    `page=${page || 1}`,
    `per_page=${perPage}`,
    `sort=${newSort}`,
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
  [RepresentativeType.VETERAN_SERVICE_ORGANIZATION]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'Claims agent',
};

export const representativeTypesOptions = {
  [RepresentativeType.NONE]: '',
  [RepresentativeType.VETERAN_SERVICE_ORGANIZATION]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIM_AGENTS]: 'Claims agent',
};
