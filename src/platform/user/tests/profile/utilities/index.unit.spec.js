import { expect } from 'chai';

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
    // This url change is to work around the VA Profile Service data mocking
    beforeEach(() => {
      oldLocation = document.location.href;
      global.dom.reconfigure({ url: 'https://www.va.gov' });
    });
    afterEach(() => {
      global.dom.reconfigure({ url: oldLocation });
    });
    it('should map profile', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.status).to.equal(data.attributes.va_profile.status);
    });

    it('should map veteran status', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.veteranStatus).to.deep.equal({
        status: data.attributes.veteran_status.status,
        isVeteran: data.attributes.veteran_status.is_veteran,
        servedInMilitary: data.attributes.veteran_status.served_in_military,
      });
    });

    it('should map vet 360 info', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.vapContactInfo).to.deep.equal(
        data.attributes.vet360_contact_information,
      );
    });

    it('should map the facilities if they are set', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.facilities).to.deep.equal(
        data.attributes.va_profile.facilities,
      );
    });

    it('should not add facilities if they are not set', () => {
      const data = createDefaultData();
      delete data.attributes.va_profile.facilities;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.facilities).to.be.undefined;
    });

    it('should handle profile error', () => {
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

      expect(mappedData.status).to.equal('SERVER_ERROR');
    });

    it('should handle veteran status error', () => {
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

      expect(mappedData.veteranStatus.status).to.equal('NOT_FOUND');
    });

    it('should handle vet 360 error', () => {
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

      expect(mappedData.vapContactInfo.status).to.equal('SERVER_ERROR');
    });
  });
});
