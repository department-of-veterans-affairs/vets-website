import environment from 'platform/utilities/environment';
import compact from 'lodash/compact';
import { RepresentativeType } from './constants';
import manifest from './manifest.json';
// import { facilityLocatorLatLongOnly } from './utils/featureFlagSelectors';

const apiSettings = {
  credentials: 'include',
  headers: {
    'X-Key-Inflection': 'camel',

    // Pull app name directly from manifest since this config is defined
    // before startApp, and using window.appName here would result in
    // undefined for all requests that use this config.
    'Source-App-Name': manifest.entryName,
  },
};

export const sortOptions = {
  DISTANCE_ASC: 'Distance (closest to farthest)',
  DISTANCE_DESC: 'Distance (farthest to closest)',
  FIRST_NAME_ASC: 'First Name (A - Z)',
  FIRST_NAME_DESC: 'First Name (Z - A)',
  LAST_NAME_ASC: 'Last Name (A - Z)',
  LAST_NAME_DESC: 'Last Name (Z - A)',
};

const railsEngineApi = {
  baseUrl: `${
    environment.API_URL
  }/services/veteran/v0/accredited_representatives`,
  url: `${environment.API_URL}/services/veteran/v0/accredited_representatives`,
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
  page = 1,
  perPage = 10,
  sort,
  type = 'organization',
}) => {
  const api = getAPI();

  const { url } = api;

  const params = [
    address ? `address=${address}` : null,
    lat?.length > 0 ? `latitude=${lat}` : null,
    long?.length > 0 ? `longitude=${long}` : null,
    name ? `name=${name}` : null,
    `page=${page}`,
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
  [RepresentativeType.VETERAN_SERVICE_ORGANIZATION]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIMS_AGENT]: 'Claims Agent',
};

export const representativeTypesOptions = {
  [RepresentativeType.NONE]: '',
  [RepresentativeType.VETERAN_SERVICE_ORGANIZATION]: 'VSO',
  [RepresentativeType.ATTORNEY]: 'Attorney',
  [RepresentativeType.CLAIMS_AGENT]: 'Claims Agent',
};
