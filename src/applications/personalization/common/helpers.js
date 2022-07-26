import { CSP_IDS } from 'platform/user/authentication/constants';
import { makeMockContactInfo } from '~/platform/user/profile/vap-svc/util/local-vapsvc.js';

export function makeUserObject(options = {}) {
  const services = options.services || ['vet360'];
  if (options.rx) {
    services.push('rx');
  }
  if (options.messaging) {
    services.push('messaging');
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
