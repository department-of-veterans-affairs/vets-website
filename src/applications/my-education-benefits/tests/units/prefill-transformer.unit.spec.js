// src/applications/my-education-benefits/tests/units/prefill-transformer.unit.spec.js

import { expect } from 'chai';
import { prefillTransformer } from '../../helpers';

// Bring in the fixture data
import {
  claimantInfo,
  mockDomesticUserState,
  mockInternationalAddressUserState,
} from '../fixtures/data/prefill-transformer-test-data';

describe('prefillTransformer', () => {
  describe('transforms claimantId', () => {
    it('the transformed claimant info includes a claimantId', () => {
      // Build a minimal Redux "state" shape:
      const state = {
        featureToggles: {
          loading: false,
          mebKickerNotificationEnabled: false,
        },
        // Merge claimantInfo into state.data
        data: {
          bankInformation: {},
          // This is the shape used by your code: "state.data.formData.data.attributes..."
          formData: claimantInfo.data.formData,
        },
        user: {
          profile: {}, // For now, no VAP
        },
      };

      // Call the transformer
      const transformed = prefillTransformer({}, {}, {}, state);

      // Expect formData.claimantId to match
      expect(transformed?.formData?.claimantId).to.eql('1000000000000246');
    });
  });

  describe('transforms contact method', () => {
    it('the transformed claimant has the correct contact method in V2', () => {
      // We want the "notificationMethod = EMAIL" to map to
      // "No, just send me email notifications"

      const state = {
        featureToggles: {
          loading: false,
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
      expect(
        transformed?.formData?.['view:receiveTextMessages']
          ?.receiveTextMessages,
      ).to.eql('No, just send me email notifications');
    });
  });
});

describe('prefillTransformer with International Address', () => {
  describe('transforms international country code', () => {
    it('claimant has the correct Country Mapping: ESP', () => {
      // Build a Redux state that has no "claimant" (or a minimal one),
      // but includes a VAP mailingAddress with "ESP"
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            // If you need some default keys on formData, add them here.
            // This can be blank or partial because your code will fill it in
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockInternationalAddressUserState, // merges user.profile
      };

      const transformed = prefillTransformer({}, {}, {}, state);
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.country,
      ).to.eql('ESP');
    });
  });

  describe('transforms international state or province', () => {
    it('claimant has the correct province in V2', () => {
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockInternationalAddressUserState,
      };

      const result = prefillTransformer({}, {}, {}, state);
      expect(result?.formData?.['view:mailingAddress']?.address?.state).to.eql(
        'Comunidad De Madrid',
      );
    });
  });

  describe('transforms international postal code', () => {
    it('claimant has the correct postal code in V2', () => {
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockInternationalAddressUserState,
      };

      const result = prefillTransformer({}, {}, {}, state);
      expect(
        result?.formData?.['view:mailingAddress']?.address?.postalCode,
      ).to.eql('28014');
    });
  });
});

describe('prefillTransformer with Domestic Address', () => {
  describe('transforms USA country code', () => {
    it('claimant has the correct Country Mapping: USA', () => {
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockDomesticUserState, // merges user.profile
      };

      const transformed = prefillTransformer({}, {}, {}, state);
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.country,
      ).to.eql('USA');
    });
  });

  describe('transforms domestic state code', () => {
    it('claimant has the correct state code in V2', () => {
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockDomesticUserState,
      };

      const transformed = prefillTransformer({}, {}, {}, state);
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.state,
      ).to.eql('WI');
    });
  });

  describe('transforms domestic postal code', () => {
    it('claimant has the correct postal code in V2', () => {
      const state = {
        featureToggles: { loading: false },
        data: {
          bankInformation: {},
          formData: {
            data: { attributes: { claimant: {} } },
          },
        },
        ...mockDomesticUserState,
      };

      const transformed = prefillTransformer({}, {}, {}, state);
      expect(
        transformed?.formData?.['view:mailingAddress']?.address?.postalCode,
      ).to.eql('53005');
    });
  });
});
