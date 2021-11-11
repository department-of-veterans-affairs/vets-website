import { expect } from 'chai';
import { prefillTransformer } from '../helpers';
import { claimantInfo } from './fixtures/data/claimant-info-test-data';

let mockClaimantInfo;

describe('prefillTransformer', () => {
  beforeEach(() => {
    mockClaimantInfo = JSON.parse(JSON.stringify(claimantInfo));
  });

  describe('transforms claimantId', () => {
    it('the transformed claimant info includes a claimantId', () => {
      const transformedClaimantInfo = prefillTransformer(
        null,
        null,
        null,
        mockClaimantInfo,
      );

      // Check the military claimant section
      expect(transformedClaimantInfo.claimantId).to.eql(
        mockClaimantInfo.claimantId,
      );
    });
  });
});
