import { expect } from 'chai';
import {
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  LIMITED_CONSENT_RESPONSE,
} from '../../constants';
import {
  hasPrivateEvidence,
  hasPrivateLimitation,
  hasOtherEvidence,
  hasOtherHousingRisk,
  hasVAEvidence,
} from '../../utils/form-data-retrieval';

describe('utils: form data retrieval', () => {
  describe('hasPrivateLimitation', () => {
    it('should return expected value', () => {
      const getData = limit => ({
        [EVIDENCE_PRIVATE]: true,
        [LIMITED_CONSENT_RESPONSE]: limit,
      });

      expect(hasPrivateLimitation(getData(false))).to.be.false;
      expect(hasPrivateLimitation(getData())).to.be.false;
      expect(hasPrivateLimitation(getData(''))).to.be.false;
      expect(hasPrivateLimitation(getData('test'))).to.be.true;
      expect(hasPrivateLimitation(getData(true))).to.be.true;
    });
  });

  describe('hasPrivateEvidence', () => {
    it('should return expected value', () => {
      expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: undefined })).to.be.false;
      expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: true })).to.be.true;
      expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: false })).to.be.false;
    });
  });

  describe('hasVAEvidence', () => {
    it('should return expected value', () => {
      expect(hasVAEvidence({ [EVIDENCE_VA]: undefined })).to.be.undefined;
      expect(hasVAEvidence({ [EVIDENCE_VA]: true })).to.be.true;
      expect(hasVAEvidence({ [EVIDENCE_VA]: false })).to.be.false;
    });
  });

  describe('hasOtherEvidence', () => {
    it('should return expected value', () => {
      expect(hasOtherEvidence({ [EVIDENCE_OTHER]: undefined })).to.be.undefined;
      expect(hasOtherEvidence({ [EVIDENCE_OTHER]: true })).to.be.true;
      expect(hasOtherEvidence({ [EVIDENCE_OTHER]: false })).to.be.false;
    });
  });

  describe('hasOtherHousingRisk', () => {
    const getResult = (valueA, valueB) => {
      return hasOtherHousingRisk({
        housingRisk: valueA,
        livingSituation: { other: valueB },
      });
    };

    it('should return expected value', () => {
      // Other is false
      expect(getResult(undefined, false)).to.be.false;
      expect(getResult(true, false)).to.be.false;
      expect(getResult(false, false)).to.be.false;

      // Other is true / both true
      expect(getResult(undefined, true)).to.be.false;
      expect(getResult(true, true)).to.be.true;
      expect(getResult(false, true)).to.be.false;

      // Both undefined
      expect(getResult(undefined, undefined)).to.be.false;

      // Both false
      expect(getResult(false, false)).to.be.false;
    });
  });
});
