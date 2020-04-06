import { mapRawUserDataToState } from '../../../profile/utilities';
import { VA_FORM_IDS } from 'platform/forms/constants';

/* eslint-disable camelcase */
function createDefaultData() {
  return {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
        'form-save-in-progress',
        'form-prefill',
      ],
      vet360_contact_information: {
        test: 'test',
      },
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
        facilities: [
          { facilityId: '983', isCerner: false },
          { facilityId: '984', isCerner: false },
        ],
      },
    },
  };
}

let oldLocation;

describe('Profile utilities', () => {
  describe('mapRawUserDataToState', () => {
    // This url change is to work around the Vet 360 data mocking
    beforeEach(() => {
      oldLocation = document.location.href;
      global.dom.reconfigure({ url: 'https://www.va.gov' });
    });
    afterEach(() => {
      global.dom.reconfigure({ url: oldLocation });
    });
    test('should map profile', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.status).toBe(data.attributes.va_profile.status);
    });

    test('should map veteran status', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.isVeteran).toBe(
        data.attributes.veteran_status.is_veteran,
      );
      expect(mappedData.veteranStatus).toEqual({
        isVeteran: data.attributes.veteran_status.is_veteran,
        veteranStatus: {
          status: data.attributes.veteran_status.status,
          isVeteran: data.attributes.veteran_status.is_veteran,
          servedInMilitary: data.attributes.veteran_status.served_in_military,
        },
        servedInMilitary: data.attributes.veteran_status.served_in_military,
      });
    });

    test('should map vet 360 info', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.vet360).toEqual(
        data.attributes.vet360_contact_information,
      );
    });

    test('should map the facilities if they are set', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.facilities).toEqual(
        data.attributes.va_profile.facilities,
      );
    });

    test('should not add facilities if they are not set', () => {
      const data = createDefaultData();
      delete data.attributes.va_profile.facilities;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.facilities).toBeUndefined();
    });

    test('should handle profile error', () => {
      const data = createDefaultData();
      data.attributes.va_profile = null;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: [
            {
              externalService: 'MVI',
              status: 500,
            },
          ],
        },
      });

      expect(mappedData.status).toBe('SERVER_ERROR');
    });

    test('should handle veteran status error', () => {
      const data = createDefaultData();
      data.attributes.veteran_status = null;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: [
            {
              externalService: 'EMIS',
              status: 404,
            },
          ],
        },
      });

      expect(mappedData.veteranStatus).toBe('NOT_FOUND');
    });

    test('should handle vet 360 error', () => {
      const data = createDefaultData();
      data.attributes.vet360_contact_information = null;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: [
            {
              externalService: 'Vet360',
              status: 'SERVER_ERROR',
            },
          ],
        },
      });

      expect(mappedData.vet360.status).toBe('SERVER_ERROR');
    });
  });
});
