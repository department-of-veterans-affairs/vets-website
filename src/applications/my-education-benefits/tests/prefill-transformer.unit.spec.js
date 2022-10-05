import { expect } from 'chai';
import { formFields } from '../constants';
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
      expect(transformedClaimantInfo.formData[formFields.claimantId]).to.eql(
        '1000000000000246',
      );
    });
  });

  describe('transforms contact method', () => {
    it('the transformed claimant has the correct contact method', () => {
      const transformedClaimantInfo = prefillTransformer(
        null,
        null,
        null,
        mockClaimantInfo,
      );

      // Check the military claimant section
      expect(transformedClaimantInfo.formData[formFields.contactMethod]).to.eql(
        'Mail',
      );
    });
  });
});
