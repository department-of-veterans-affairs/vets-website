// src/applications/my-education-benefits/tests/units/prefill-transformer.unit.spec.js

import { expect } from 'chai';
import { prefillTransformer } from '../../helpers';
import {
  claimantInfo,
  mockDomesticUserState,
  mockInternationalAddressUserState,
} from '../fixtures/data/prefill-transformer-test-data';

describe('prefillTransformer', () => {
  describe('Scenario: Basic claimant data (no VAP)', () => {
    it('transforms claimantId and contact method with mebKickerNotificationEnabled=OFF', () => {
      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: false, // OFF
        },
        data: {
          bankInformation: {},
          formData: claimantInfo.data.formData,
        },
        user: {
          profile: {}, // no VAP contact info
        },
      };

      // Call the transformer
      const transformed = prefillTransformer({}, {}, {}, state);

      // 1) Check claimantId
      expect(transformed?.formData?.claimantId).to.eql('1000000000000246');

      // 2) Check contact method => "EMAIL" => "No, just send me email notifications"
      const receiveText =
        transformed?.formData?.['view:receiveTextMessages']
          ?.receiveTextMessages;
      expect(receiveText).to.eql('No, just send me email notifications');

      // 3) Because mebKickerNotificationEnabled=OFF, no kicker data
      expect(transformed?.formData?.activeDutyKicker).to.be.undefined;
      expect(transformed?.formData?.selectedReserveKicker).to.be.undefined;
    });

    it('transforms claimantId with mebKickerNotificationEnabled=ON, but no eligibility => undefined', () => {
      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: true, // ON
        },
        data: {
          bankInformation: {},
          formData: claimantInfo.data.formData,
        },
        user: { profile: {} },
      };

      const transformed = prefillTransformer({}, {}, {}, state);
      // Kicker data is not present because no "eligibleForActiveDutyKicker=true" set
      expect(transformed?.formData?.activeDutyKicker).to.be.undefined;
      expect(transformed?.formData?.selectedReserveKicker).to.be.undefined;
    });

    it('mebKickerNotificationEnabled=ON with claimant eligible for BOTH active & reserve => "Yes"', () => {
      // Copy the test data, then mutate claimant to set kicker flags
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.eligibleForActiveDutyKicker = true;
      claimantCopy.data.formData.data.attributes.claimant.eligibleForReserveKicker = true;

      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: true, // ON
        },
        data: {
          bankInformation: {},
          formData: claimantCopy.data.formData,
        },
        user: { profile: {} },
      };

      const transformed = prefillTransformer({}, {}, {}, state);

      // Because mebKickerNotificationEnabled=ON + eligibility= true => 'Yes'
      expect(transformed?.formData?.activeDutyKicker).to.eql('Yes');
      expect(transformed?.formData?.selectedReserveKicker).to.eql('Yes');
    });

    it('mebKickerNotificationEnabled=ON with only Reserve kicker => "Yes" for reserve, undefined for active', () => {
      const claimantCopy = JSON.parse(JSON.stringify(claimantInfo));
      claimantCopy.data.formData.data.attributes.claimant.eligibleForReserveKicker = true;
      // activeDutyKicker not set or false

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

      expect(transformed?.formData?.selectedReserveKicker).to.eql('Yes');
      // Active duty should remain undefined
      expect(transformed?.formData?.activeDutyKicker).to.be.undefined;
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

      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.street,
      ).to.eql('170 Colorado Dr');
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.country,
      ).to.eql('USA');
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.state,
      ).to.eql('WI');
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
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.street,
      ).to.eql('123 Martin Luther King Blvd');
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.country,
      ).to.eql('USA'); // derived from 'US'
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
      expect(
        result?.formData?.['view:mailingAddress']?.address?.country,
      ).to.eql('ESP');
      expect(result?.formData?.['view:mailingAddress']?.address?.state).to.eql(
        'Comunidad De Madrid',
      );
      expect(
        result?.formData?.['view:mailingAddress']?.address?.postalCode,
      ).to.eql('28014');
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
              // no homePhone, no mobilePhone
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
      // Expect phone to exist but be undefined
      expect(
        transformed.formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
      ).to.be.undefined;
      expect(transformed.formData['view:phoneNumbers']?.phoneNumber?.phone).to
        .be.undefined;
    });
  });
});
