import { expect } from 'chai';
import { prefillTransformerV1, prefillTransformerV2 } from '../helpers';
import { claimantInfo } from './fixtures/data/claimant-info-test-data';

let mockClaimantInfo;

describe('prefillTransformer', () => {
  beforeEach(() => {
    mockClaimantInfo = JSON.parse(JSON.stringify(claimantInfo));
  });

  describe('transforms claimantId', () => {
    it('the transformed claimant info includes a claimantId', () => {
      const transformedClaimantInfo = prefillTransformerV2(
        null,
        null,
        null,
        mockClaimantInfo,
      );
      // Check the military claimant section
      expect(transformedClaimantInfo?.formData?.claimantId).to.eql(
        '1000000000000246',
      );
    });
  });
  describe('transforms contact method', () => {
    it('the transformed claimant has the correct contact method in V1', () => {
      const transformedClaimantInfo = prefillTransformerV1(
        null,
        null,
        null,
        mockClaimantInfo,
      );
      // Check the military claimant section
      expect(
        transformedClaimantInfo?.formData['view:contactMethod'].contactMethod,
      ).to.eql('EMAIL');
    });
  });
  describe('transforms contact method', () => {
    it('the transformed claimant has the correct contact method in V2', () => {
      const transformedClaimantInfo = prefillTransformerV2(
        null,
        null,
        null,
        mockClaimantInfo,
      );
      // Check the military claimant section
      expect(
        transformedClaimantInfo?.formData['view:receiveTextMessages']
          .receiveTextMessages,
      ).to.eql('No, just send me email notifications');
    });
  });
});
