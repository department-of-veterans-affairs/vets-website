import { expect } from 'chai';

import { mapRawUserDataToState } from 'platform/user/profile/utilities';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { CSP_IDS } from 'platform/user/authentication/constants';

/* eslint-disable camelcase */
function createDefaultData() {
  return {
    attributes: {
      userAccount: {
        id: 'user-1234',
      },
      profile: {
        sign_in: {
          service_name: CSP_IDS.ID_ME,
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
        user_at_pretransitioned_oh_facility: false,
        user_facility_ready_for_info_alert: false,
      },
    },
  };
}

let oldLocation;

describe('Profile utilities', () => {
  describe('mapRawUserDataToState', () => {
    // This url change is to work around the VA Profile Service data mocking
    beforeEach(() => {
      oldLocation = window.location.href;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: 'https://www.va.gov' },
      });
    });
    afterEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: oldLocation },
      });
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

    it('should map account UUID', () => {
      const data = createDefaultData();
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.accountUuid).to.deep.equal(
        data.attributes.userAccount.id,
      );
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

    it('should handle upstream VET360/VA Profile server errors', () => {
      const data = createDefaultData();
      data.attributes.vet360_contact_information = null;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: [
            {
              externalService: 'VAProfile',
              startTime: '2020-11-19T17:32:54Z',
              endTime: null,
              description:
                'VET360_502, 502, Bad Gateway, Received an an invalid response from the upstream server',
              status: 502,
            },
          ],
        },
      });
      expect(mappedData.vapContactInfo.status).to.equal('SERVER_ERROR');
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

    it('should map userAtPretransitionedOhFacility flag as true when set', () => {
      const data = createDefaultData();
      data.attributes.va_profile.user_at_pretransitioned_oh_facility = true;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.userAtPretransitionedOhFacility).to.equal(true);
    });

    it('should map userFacilityReadyForInfoAlert flag as true when set', () => {
      const data = createDefaultData();
      data.attributes.va_profile.user_facility_ready_for_info_alert = true;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.userFacilityReadyForInfoAlert).to.equal(true);
    });

    it('should handle missing userAtPretransitionedOhFacility flag', () => {
      const data = createDefaultData();
      delete data.attributes.va_profile.user_at_pretransitioned_oh_facility;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.userAtPretransitionedOhFacility).to.be.undefined;
    });

    it('should handle missing userFacilityReadyForInfoAlert flag', () => {
      const data = createDefaultData();
      delete data.attributes.va_profile.user_facility_ready_for_info_alert;
      const mappedData = mapRawUserDataToState({
        data,
        meta: {
          errors: null,
        },
      });

      expect(mappedData.userFacilityReadyForInfoAlert).to.be.undefined;
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
              externalService: 'VAProfile',
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
              externalService: 'VAProfile',
              status: 'SERVER_ERROR',
            },
          ],
        },
      });

      expect(mappedData.vapContactInfo.status).to.equal('SERVER_ERROR');
    });
  });
});
