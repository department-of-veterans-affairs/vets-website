import { expect } from 'chai';
import { prefillTransformer } from '../helpers';
import { getSchemaCountryCode } from '../utils/form-submit-transform';
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

  describe('default country to USA', () => {
    it('the country is set to USA when there is no country code', () => {
      const countryWhenUndefined = getSchemaCountryCode(undefined);

      expect(countryWhenUndefined).to.eql('USA');
    });

    it('the country is set to USA when there is an invalid/unknown country code', () => {
      const countryWhenZZ = getSchemaCountryCode('ZZ'); // ZZ is LTS for 'unknown'

      expect(countryWhenZZ).to.eql('USA');
    });

    it("but don't overide countries when we do get a value", () => {
      const countryWhenUndefined = getSchemaCountryCode('GM');

      expect(countryWhenUndefined).to.eql('DEU');
    });
  });
});
