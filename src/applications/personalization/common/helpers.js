/* eslint-disable camelcase */
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { makeMockContactInfo } from '~/platform/user/profile/vap-svc/util/local-vapsvc';

export function makeUserObject(options = {}) {
  const services = options.services || ['vet360'];
  let claims = {
    ch33_bank_accounts: true,
    communication_preferences: true,
    connected_apps: true,
    military_history: true,
    payment_history: true,
    personal_information: true,
    rating_info: true,
    appeals: true,
    medical_copays: true,
  };
  if (options.rx) {
    services.push('rx');
  }
  if (options.messaging) {
    services.push('messaging');
  }
  if (options.claims) {
    claims = options.claims;
  }
  return {
    data: {
      id: '',
      type: 'users_scaffolds',
      attributes: {
        services,
        account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
        profile: {
          email: 'vets.gov.user+36@gmail.com',
          firstName: 'WESLEY',
          middleName: 'WATSON',
          lastName: 'FORD',
          birthDate: '1986-05-06',
          gender: 'M',
          zip: '21122-6706',
          lastSignedIn: '2020-07-21T00:04:51.589Z',
          loa: { current: options.loa || 3, highest: 3 },
          multifactor: options.multifactor ?? true,
          verified: true,
          signIn: {
            serviceName: options.serviceName || CSP_IDS.ID_ME,
            accountType: 'N/A',
            ssoe: true,
          },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
          claims,
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19860506',
          familyName: 'Ford',
          gender: 'M',
          givenNames: ['Wesley', 'Watson'],
          isCernerPatient: options.isCerner ?? false,
          facilities:
            options.isPatient && options.facilities ? options.facilities : null,
          vaPatient: options.isPatient ?? false,
          mhvAccountState: options.mhvAccountState ?? 'OK',
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
          servedInMilitary: true,
        },
        inProgressForms: options.inProgressForms || [],
        prefillsAvailable: [],
        vet360ContactInformation:
          options.contactInformation || makeMockContactInfo(),
      },
    },
    meta: { errors: null },
  };
}

/**
 * Formats a full name from the given first, middle, last, and suffix
 *
 * @export
 * @param {*} {
 *   first = '',
 *   middle = '',
 *   last = '',
 *   suffix = '',
 * }
 * @return {string} The full name formatted with spaces
 */
export function formatFullName({
  first = '',
  middle = '',
  last = '',
  suffix = '',
}) {
  // ensure that any middle initials are capitalized
  const formattedMiddle = middle
    ? middle.replaceAll(/\b\w{1}\b/g, c => c.toUpperCase())
    : '';
  return [first, formattedMiddle, last, suffix]
    .filter(name => !!name)
    .join(' ');
}

export const normalizePath = path => {
  // trim whitespace and remove trailing slash
  const pathTrimmed = path.trim();
  return pathTrimmed.endsWith('/') ? path.slice(0, -1) : path;
};

export const getRouteInfoFromPath = (path, routes) => {
  const normalizedPath = normalizePath(path);
  const returnRouteInfo = routes.find(({ path: routePath }) => {
    return routePath === normalizedPath;
  });
  if (!returnRouteInfo) {
    throw new Error('No route found for path');
  }
  return returnRouteInfo;
};

const CLIENT_ERROR_REGEX = /^4\d{2}$/;
const SERVER_ERROR_REGEX = /^5\d{2}$/;

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);
export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);
