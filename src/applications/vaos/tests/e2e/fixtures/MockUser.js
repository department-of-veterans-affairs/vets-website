/* eslint-disable @department-of-veterans-affairs/use-workspace-imports */
import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc';

/**
 * Mock user class.
 *
 * @export
 * @class MockUser
 */
export default class MockUser {
  /**
   * Creates an instance of MockUser.
   * @param {Object} props - Properties used to determine what type of mock user to create.
   * @param {Array} [props.facilities=] - Set user registered facilities.
   * @param {string} [props.addressLine1 = '345 Home Address St'] - Set user home address
   * @param {String} [props.id = '1'] - Set user id.
   * @memberof MockUser
   */
  constructor({ addressLine1, facilities, id = '1' } = {}) {
    this.data = {
      id: id.toString(),
      type: 'MockUser',
      attributes: {
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'form-save-in-progress',
          'form-prefill',
          'evss-claims',
          'form526',
          'user-profile',
          'appeals-status',
          'identity-proofed',
        ],
        account: {
          accountUuid: '6af59b36-f14d-482e-88b4-3d7820422343',
        },
        profile: {
          email: 'vets.gov.user+228@gmail.com',
          firstName: 'MARK',
          middleName: null,
          lastName: 'WEBB',
          birthDate: '1950-10-04',
          gender: 'M',
          zip: null,
          lastSignedIn: '2020-06-18T21:15:19.664Z',
          loa: {
            current: 3,
            highest: 3,
          },
          multifactor: true,
          verified: true,
          signIn: {
            serviceName: 'idme',
            accountType: 'N/A',
          },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3/vets',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19501004',
          familyName: 'Webb-ster',
          gender: 'M',
          givenNames: ['Mark'],
          isCernerPatient: false,
          facilities: facilities || [
            {
              facilityId: '983',
              isCerner: false,
            },
          ],
          vaPatient: true,
          mhvAccountState: 'NONE',
        },
        veteranStatus: null,
        inProgressForms: [],
        prefillsAvailable: [
          '21-686C',
          '40-10007',
          '22-1990',
          '22-1990N',
          '22-1990E',
          '22-1995',
          '22-1995S',
          '22-5490',
          '22-5495',
          '22-0993',
          '22-0994',
          'FEEDBACK-TOOL',
          '22-10203',
          '21-526EZ',
          '1010ez',
          '21P-530',
          '21P-527EZ',
          '686C-674',
          '20-0996',
          'MDOT',
        ],
        vet360ContactInformation: {
          ...mockContactInformation,
          email: {
            ...mockContactInformation.email,
            emailAddress: null,
          },
          homePhone: {
            ...mockContactInformation.homePhone,
            areaCode: null,
            phoneNumber: null,
          },
          mobilePhone: {
            ...mockContactInformation.mobilePhone,
            areaCode: null,
            phoneNumber: null,
          },
          residentialAddress: addressLine1
            ? {
                addressLine1,
                city: 'FPO',
                stateCode: 'AE',
                zipCode: '09618',
                latitude: 37.5615,
                longitude: -121.9988,
              }
            : {},
        },
      },
      meta: { errors: null },
    };
  }

  setAddress(addressLine1) {
    let {
      address,
    } = this.data.attributes.vet360ContactInformation.residentialAddress;

    if (address) {
      address = addressLine1;
    } else {
      this.data.attributes.vet360ContactInformation.residentialAddress = {
        addressLine1,
        city: 'FPO',
        latitude: 37.5615,
        longitude: -121.9988,
        stateCode: 'AE',
        zipCode: '09618',
      };
    }

    return this;
  }
}
