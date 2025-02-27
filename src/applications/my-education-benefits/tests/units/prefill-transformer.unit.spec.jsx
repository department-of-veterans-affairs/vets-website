import { expect } from 'chai';
import { prefillTransformerV1, prefillTransformerV2 } from '../../helpers';
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
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockClaimantInfo,
      });
      // Check the military claimant section
      expect(transformedClaimantInfo?.formData?.claimantId).to.eql(
        '1000000000000246',
      );
    });
  });
  describe('transforms contact method', () => {
    it('the transformed claimant has the correct contact method in V2', () => {
      const transformedClaimantInfo = prefillTransformerV1(null, null, null, {
        ...mockClaimantInfo,
      });
      // Check the military claimant section
      expect(
        transformedClaimantInfo?.formData['view:receiveTextMessages']
          .receiveTextMessages,
      ).to.eql('No, just send me email notifications');
    });
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
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockInternationalClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
          ?.country,
      ).to.eql('ESP');
    });
  });

  describe('transforms international state or province', () => {
    it('claimant has the correct state or province in V2', () => {
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockInternationalClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
          ?.state,
      ).to.eql('Comunidad De Madrid');
    });
  });

  describe('transforms international postal code', () => {
    it('claimant has the correct postal code in V2', () => {
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockInternationalClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
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
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockDomesticClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
          ?.country,
      ).to.eql('USA');
    });
  });

  describe('transforms international state or province', () => {
    it('claimant has the correct state code or province in V2', () => {
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockDomesticClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
          ?.state,
      ).to.eql('WI');
    });
  });

  describe('transforms international postal code', () => {
    it('claimant has the correct postal code in V2', () => {
      const transformedClaimantInfo = prefillTransformerV2(null, null, null, {
        ...mockDomesticClaimantInfo,
      });
      expect(
        transformedClaimantInfo?.formData['view:mailingAddress']?.address
          ?.postalCode,
      ).to.eql('53005');
    });
  });
});
