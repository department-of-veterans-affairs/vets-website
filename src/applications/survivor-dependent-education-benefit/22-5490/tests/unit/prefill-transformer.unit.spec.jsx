import { expect } from 'chai';
import { prefillTransformer } from '../../helpers';
import {
  claimantInfo,
  mockDomesticUserState,
  mockInternationalAddressUserState,
} from '../fixtures/data/prefill-transformer-test-data';

let mockClaimantInfo;

describe('prefillTransformer', () => {
  beforeEach(() => {
    mockClaimantInfo = JSON.parse(JSON.stringify(claimantInfo));
  });

  describe('transforms claimantId', () => {
    it('the transformed claimant info includes a claimantId', () => {
      const transformedClaimantInfo = prefillTransformer(null, null, null, {
        ...mockClaimantInfo,
      });
      // Check the military claimant section
      expect(transformedClaimantInfo?.formData?.claimantId).to.eql(
        '1000000000000246',
      );
    });
  });

  describe('transforms notification method', () => {
    it('the transformed claimant has the correct notification method', () => {
      const transformedClaimantInfo = prefillTransformer(null, null, null, {
        ...mockClaimantInfo,
      });
      // Check the military claimant section
      expect(transformedClaimantInfo?.formData?.notificationMethod).to.eql(
        'EMAIL',
      );
    });
  });

  let mockInternationalClaimantInfo;
  describe('prefillTransformer with International Address', () => {
    beforeEach(() => {
      mockInternationalClaimantInfo = JSON.parse(
        JSON.stringify(mockInternationalAddressUserState),
      );
    });

    describe('transforms international country code', () => {
      it('claimant has the correct Country Mapping', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockInternationalClaimantInfo,
        });
        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.country,
        ).to.eql('ESP');
      });
    });

    describe('transforms international state or province', () => {
      it('claimant has the correct state or province', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockInternationalClaimantInfo,
        });
        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.state,
        ).to.eql('Comunidad De Madrid');
      });
    });

    describe('transforms international postal code', () => {
      it('claimant has the correct postal code', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockInternationalClaimantInfo,
        });

        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.postalCode,
        ).to.eql('28014');
      });
    });
  });

  let mockDomesticClaimantInfo;
  describe('prefillTransformer with International Address', () => {
    beforeEach(() => {
      mockDomesticClaimantInfo = JSON.parse(
        JSON.stringify(mockDomesticUserState),
      );
    });

    describe('transforms USA country code', () => {
      it('claimant has the correct Country Mapping', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockDomesticClaimantInfo,
        });

        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.country,
        ).to.eql('USA');
      });
    });

    describe('transforms international state or province', () => {
      it('claimant has the correct state code or province', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockDomesticClaimantInfo,
        });
        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.state,
        ).to.eql('WI');
      });
    });

    describe('transforms international postal code', () => {
      it('claimant has the correct postal code', () => {
        const transformedClaimantInfo = prefillTransformer(null, null, null, {
          ...mockDomesticClaimantInfo,
        });
        expect(
          transformedClaimantInfo?.formData?.mailingAddressInput?.address
            ?.postalCode,
        ).to.eql('53005');
      });
    });
  });

  describe('Bank account confirmation fields prefill', () => {
    it('correctly pre-fills routingNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Checking',
            accountNumber: '12345678',
            routingNumber: '123456789',
          },
          formData: claimantInfo.data.formData,
        },
        user: { profile: {} },
      };

      const result = prefillTransformer(null, null, null, state);

      expect(
        result.formData['view:directDeposit'].bankAccount
          .routingNumberConfirmation,
      ).to.equal('123456789');
    });

    it('correctly pre-fills accountNumberConfirmation field from bankInformation', () => {
      const state = {
        data: {
          bankInformation: {
            accountType: 'Savings',
            accountNumber: '98765432101',
            routingNumber: '987654321',
          },
          formData: claimantInfo.data.formData,
        },
        user: { profile: {} },
      };

      const result = prefillTransformer(null, null, null, state);

      expect(
        result.formData['view:directDeposit'].bankAccount
          .accountNumberConfirmation,
      ).to.equal('98765432101');
    });

    it('handles missing bankInformation gracefully', () => {
      const state = {
        data: {
          bankInformation: {},
          formData: claimantInfo.data.formData,
        },
        user: { profile: {} },
      };

      const result = prefillTransformer(null, null, null, state);

      expect(result.formData?.bankAccount?.routingNumberConfirmation).to.be
        .undefined;
      expect(result.formData?.bankAccount?.accountNumberConfirmation).to.be
        .undefined;
    });
  });
});
