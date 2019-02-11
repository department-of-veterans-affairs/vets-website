import { expect } from 'chai';

import { mapRawUserDataToState } from '../../../profile/utilities';

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
          form: '1010ez',
          metadata: {},
        },
      ],
      prefills_available: ['21-526EZ'],
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

      expect(mappedData.isVeteran).to.equal(
        data.attributes.veteran_status.is_veteran,
      );
      expect(mappedData.veteranStatus).to.deep.equal({
        isVeteran: data.attributes.veteran_status.is_veteran,
        veteranStatus: {
          status: data.attributes.veteran_status.status,
          isVeteran: data.attributes.veteran_status.is_veteran,
          servedInMilitary: data.attributes.veteran_status.served_in_military,
        },
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

      expect(mappedData.vet360).to.deep.equal(
        data.attributes.vet360_contact_information,
      );
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

      expect(mappedData.veteranStatus).to.equal('NOT_FOUND');
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

      expect(mappedData.vet360.status).to.equal('SERVER_ERROR');
    });
  });
});
