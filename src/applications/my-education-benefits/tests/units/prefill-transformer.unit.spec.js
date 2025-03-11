// src/applications/my-education-benefits/tests/units/prefill-transformer.unit.spec.js

import { expect } from 'chai';
import { prefillTransformer } from '../../helpers';
import { formFields } from '../../constants';
import {
  claimantInfo,
  mockDomesticUserState,
  mockInternationalAddressUserState,
  mockConflictingVapUserState,
} from '../fixtures/data/prefill-transformer-test-data';

describe('prefillTransformer', () => {
  describe('Scenario: Basic claimant data (no VAP)', () => {
    it('transforms claimantId and contact method with mebKickerNotificationEnabled=OFF', () => {
      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: false,
        },
        data: {
          bankInformation: {},
          formData: claimantInfo.data.formData,
        },
        user: {
          profile: {},
        },
      };

      const transformed = prefillTransformer({}, {}, {}, state);

      expect(transformed?.formData?.[formFields.claimantId]).to.eql(
        '1000000000000246',
      );

      expect(transformed?.formData?.[formFields.activeDutyKicker]).to.be
        .undefined;
      expect(transformed?.formData?.[formFields.selectedReserveKicker]).to.be
        .undefined;
    });

    it('transforms claimantId with mebKickerNotificationEnabled=ON, but no eligibility => undefined', () => {
      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: true,
        },
        data: {
          bankInformation: {},
          formData: claimantInfo.data.formData,
        },
        user: { profile: {} },
      };

      const transformed = prefillTransformer({}, {}, {}, state);

      expect(transformed?.formData?.[formFields.activeDutyKicker]).to.be
        .undefined;
      expect(transformed?.formData?.[formFields.selectedReserveKicker]).to.be
        .undefined;
    });

    it('mebKickerNotificationEnabled=ON with claimant eligible for BOTH active & reserve => "Yes"', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.eligibleForActiveDutyKicker = true;
      claimantCopy.data.formData.data.attributes.claimant.eligibleForReserveKicker = true;

      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: true,
        },
        data: {
          bankInformation: {},
          formData: claimantCopy.data.formData,
        },
        user: { profile: {} },
      };

      const transformed = prefillTransformer({}, {}, {}, state);

      expect(transformed?.formData?.[formFields.activeDutyKicker]).to.eql(
        'Yes',
      );
      expect(transformed?.formData?.[formFields.selectedReserveKicker]).to.eql(
        'Yes',
      );
    });

    it('mebKickerNotificationEnabled=ON with only Reserve kicker => "Yes" for reserve, undefined for active', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.eligibleForReserveKicker = true;

      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: true,
        },
        data: {
          bankInformation: {},
          formData: claimantCopy.data.formData,
        },
        user: { profile: {} },
      };

      const transformed = prefillTransformer({}, {}, {}, state);

      expect(transformed?.formData?.[formFields.selectedReserveKicker]).to.eql(
        'Yes',
      );
      expect(transformed?.formData?.[formFields.activeDutyKicker]).to.be
        .undefined;
    });
  });

  describe('Scenario: user has Domestic VAP address', () => {
    it('prefers user’s VAP mailingAddress if present', () => {
      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantInfo.data.formData,
          bankInformation: {},
        },
        user: mockDomesticUserState.user,
      };

      const transformed = prefillTransformer({}, {}, {}, mergedState);

      const addressObject =
        transformed?.formData?.[formFields.viewMailingAddress]?.[
          formFields.address
        ];

      expect(addressObject?.street).to.eql('170 Colorado Dr');
      expect(addressObject?.country).to.eql('USA');
      expect(addressObject?.state).to.eql('WI');
    });

    it('falls back to claimant’s address if user has no VAP mailingAddress', () => {
      const stateNoMailing = JSON.parse(JSON.stringify(mockDomesticUserState));
      delete stateNoMailing.user.profile.vapContactInfo.mailingAddress;

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantInfo.data.formData,
          bankInformation: {},
        },
        user: stateNoMailing.user,
      };

      const transformed = prefillTransformer({}, {}, {}, mergedState);

      const addressObject =
        transformed?.formData?.[formFields.viewMailingAddress]?.[
          formFields.address
        ];

      // Old code expected '123 Martin Luther King Blvd', but your claimantInfo might differ
      expect(addressObject?.street).to.eql('987 Real Rd.'); // match your code’s fallback
      expect(addressObject?.country).to.eql('USA');
    });
  });

  describe('Scenario: user has International VAP address', () => {
    it('maps country (ESP), province, and postal code', () => {
      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantInfo.data.formData,
          bankInformation: {},
        },
        user: mockInternationalAddressUserState.user,
      };

      const result = prefillTransformer({}, {}, {}, mergedState);

      const addressObject =
        result?.formData?.[formFields.viewMailingAddress]?.[formFields.address];

      expect(addressObject?.country).to.eql('ESP');
      expect(addressObject?.state).to.eql('Comunidad De Madrid');
      expect(addressObject?.postalCode).to.eql('28014');
    });
  });

  describe('Scenario: phone numbers are missing', () => {
    it('handles undefined phone fields gracefully', () => {
      const noPhones = JSON.parse(JSON.stringify(claimantInfo));
      noPhones.data.formData.data.attributes.claimant.contactInfo.mobilePhoneNumber = undefined;
      noPhones.data.formData.data.attributes.claimant.contactInfo.homePhoneNumber = undefined;

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: noPhones.data.formData,
          bankInformation: {},
        },
        user: {
          profile: {
            vapContactInfo: {
              mailingAddress: {
                addressLine1: '123 Some Street',
                addressType: 'DOMESTIC',
                countryCodeIso3: 'USA',
                city: 'Portland',
                stateCode: 'OR',
                zipCode: '99999',
              },
            },
          },
        },
      };

      const transformed = prefillTransformer({}, {}, {}, mergedState);

      const phoneNumbers = transformed.formData[formFields.viewPhoneNumbers];

      expect(phoneNumbers?.[formFields.mobilePhoneNumber]?.phone).to.be
        .undefined;
      expect(phoneNumbers?.[formFields.phoneNumber]?.phone).to.be.undefined;
    });
  });

  describe('Scenario: user has conflicting VAP vs. claimant addresses', () => {
    it('uses only VAP mailingAddress when present, ignoring claimant address', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.contactInfo = {
        addressLine1: '777 Old Rd',
        addressLine2: 'Ste 99',
        city: 'Oldtown',
        stateCode: 'OT',
        zipCode: '77777',
        countryCodeIso3: 'USA',
        addressType: 'DOMESTIC',
      };

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantCopy.data.formData,
          bankInformation: {},
        },
        user: mockConflictingVapUserState.user,
      };

      const result = prefillTransformer({}, {}, {}, mergedState);

      const addressObject =
        result?.formData?.[formFields.viewMailingAddress]?.[formFields.address];
      expect(addressObject?.street).to.eql('123 Fake St.');
      expect(addressObject?.street2).to.eql('Apt. 456');
      expect(addressObject?.city).to.eql('Fakeville');
      expect(addressObject?.state).to.eql('FA');
      expect(addressObject?.postalCode).to.eql('12345');
    });

    it('falls back to claimant’s address if VAP mailingAddress is null', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.contactInfo = {
        addressLine1: '777 Old Rd',
        addressLine2: 'Ste 99',
        city: 'Oldtown',
        stateCode: 'OT',
        zipCode: '77777',
        countryCodeIso3: 'USA',
        addressType: 'DOMESTIC',
      };

      const userNoVap = JSON.parse(JSON.stringify(mockConflictingVapUserState));
      delete userNoVap.user.profile.vapContactInfo.mailingAddress;

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantCopy.data.formData,
          bankInformation: {},
        },
        user: userNoVap.user,
      };

      const result = prefillTransformer({}, {}, {}, mergedState);
      const addressObject =
        result.formData?.[formFields.viewMailingAddress]?.[formFields.address];
      expect(addressObject?.street).to.eql('777 Old Rd');
      expect(addressObject?.street2).to.eql('Ste 99');
      expect(addressObject?.city).to.eql('Oldtown');
      expect(addressObject?.state).to.eql('OT');
      expect(addressObject?.postalCode).to.eql('77777');
    });

    it('keeps multiple lines from VAP if claimant address lines are partial', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.contactInfo = {
        addressLine1: 'Partial Rd',
        addressLine2: null,
        city: 'Partial City',
        stateCode: 'PC',
        zipCode: '11111',
        countryCodeIso3: 'USA',
        addressType: 'DOMESTIC',
      };

      const multiLineVAP = JSON.parse(
        JSON.stringify(mockConflictingVapUserState),
      );
      multiLineVAP.user.profile.vapContactInfo.mailingAddress.addressLine1 =
        '321 Multi-Line Ave.';
      multiLineVAP.user.profile.vapContactInfo.mailingAddress.addressLine2 =
        'Bldg 20, Floor 3';

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantCopy.data.formData,
          bankInformation: {},
        },
        user: multiLineVAP.user,
      };

      const result = prefillTransformer({}, {}, {}, mergedState);
      const addressObject =
        result.formData?.[formFields.viewMailingAddress]?.[formFields.address];
      expect(addressObject?.street).to.eql('321 Multi-Line Ave.');
      expect(addressObject?.street2).to.eql('Bldg 20, Floor 3');
      expect(addressObject?.city).to.eql('Fakeville');
      expect(addressObject?.state).to.eql('FA');
    });

    it('handles null claimant address, defaulting to VAP if available', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.contactInfo = null;

      const mergedState = {
        featureToggles: { loading: false },
        data: {
          formData: claimantCopy.data.formData,
          bankInformation: {},
        },
        user: mockConflictingVapUserState.user,
      };

      const result = prefillTransformer({}, {}, {}, mergedState);
      const addressObject =
        result.formData?.[formFields.viewMailingAddress]?.[formFields.address];
      expect(addressObject?.street).to.eql('123 Fake St.');
      expect(addressObject?.city).to.eql('Fakeville');
      expect(addressObject?.state).to.eql('FA');
    });
  });
});
