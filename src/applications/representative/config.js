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
  DISTANCE_CLOSEST_TO_FARTHEST: 'Distance (closest to farthest)',
  DISTANCE_FARTHEST_TO_CLOSEST: 'Distance (farthest to closest)',
  ALPHABETICAL_A_TO_Z: 'Alphabetical (A - Z)',
  ALPHABETICAL_Z_TO_A: 'Alphabetical (Z - A)',
};

const railsEngineApi = {
  baseUrl: `${environment.API_URL}/facilities_api/v1`,
  url: `${environment.API_URL}/facilities_api/v1/va`,
  ccUrl: `${environment.API_URL}/facilities_api/v1/ccp`,
  settings: apiSettings,
};

export const getAPI = () => railsEngineApi;

/**
 * Build parameters and URL for representative API calls
 *
 */
export const resolveParamsWithUrl = ({
  address,
  representativeType,
  page,
  bounds,
  center,
  radius,
  // store,
}) => {
  const api = getAPI();

  const { url } = api;
  let roundRadius;
  const perPage = 10;

  if (radius) roundRadius = Math.max(1, radius.toFixed());

  const locationParams = [
    address ? `address=${address}` : null,
    ...bounds.map(c => `bbox[]=${c}`),
    center && center.length > 0 ? `latitude=${center[0]}` : null,
    center && center.length > 0 ? `longitude=${center[1]}` : null,
  ];

  const representativeParams = representativeType
    ? `type=${representativeType}`
    : null;

  return {
    url,
    params: compact([
      representativeParams,
      `page=${page}`,
      `per_page=${perPage}`,
      roundRadius ? `radius=${roundRadius}` : null,
      ...locationParams,
    ]).join('&'),
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
