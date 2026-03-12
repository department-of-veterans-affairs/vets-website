import { expect } from 'chai';
import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
} from '../../constants';
import {
  getOtherEvidence,
  getPrivateEvidence,
  getVAEvidence,
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
        [HAS_PRIVATE_EVIDENCE]: true,
        [HAS_PRIVATE_LIMITATION]: limit,
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
      expect(hasPrivateEvidence({ [HAS_PRIVATE_EVIDENCE]: undefined })).to.be
        .false;
      expect(hasPrivateEvidence({ [HAS_PRIVATE_EVIDENCE]: true })).to.be.true;
      expect(hasPrivateEvidence({ [HAS_PRIVATE_EVIDENCE]: false })).to.be.false;
    });
  });

  describe('hasVAEvidence', () => {
    it('should return expected value', () => {
      expect(hasVAEvidence({ [HAS_VA_EVIDENCE]: undefined })).to.be.undefined;
      expect(hasVAEvidence({ [HAS_VA_EVIDENCE]: true })).to.be.true;
      expect(hasVAEvidence({ [HAS_VA_EVIDENCE]: false })).to.be.false;
    });
  });

  describe('hasOtherEvidence', () => {
    it('should return expected value', () => {
      expect(hasOtherEvidence({ [HAS_OTHER_EVIDENCE]: undefined })).to.be
        .undefined;
      expect(hasOtherEvidence({ [HAS_OTHER_EVIDENCE]: true })).to.be.true;
      expect(hasOtherEvidence({ [HAS_OTHER_EVIDENCE]: false })).to.be.false;
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

  describe('getVAEvidence', () => {
    it('should return expected value', () => {
      expect(
        getVAEvidence({ [HAS_VA_EVIDENCE]: undefined, locations: [{}] }),
      ).to.deep.equal([]);

      expect(
        getVAEvidence({ [HAS_VA_EVIDENCE]: true, locations: [{}] }),
      ).to.deep.equal([{}]);

      expect(
        getVAEvidence({ [HAS_VA_EVIDENCE]: true, locations: [] }),
      ).to.deep.equal([]);

      expect(
        getVAEvidence({ [HAS_VA_EVIDENCE]: false, locations: [{}] }),
      ).to.deep.equal([]);

      expect(
        getVAEvidence({
          [HAS_VA_EVIDENCE]: true,
          locations: [{ test: 'test' }],
        }),
      ).to.deep.equal([{ test: 'test' }]);
    });
  });

  describe('getPrivateEvidence', () => {
    it('should return expected value', () => {
      expect(
        getPrivateEvidence({
          [HAS_PRIVATE_EVIDENCE]: undefined,
          providerFacility: [{}],
        }),
      ).to.deep.equal([]);
      expect(
        getPrivateEvidence({
          [HAS_PRIVATE_EVIDENCE]: true,
          providerFacility: [{}],
        }),
      ).to.deep.equal([{}]);
      expect(
        getPrivateEvidence({
          [HAS_PRIVATE_EVIDENCE]: true,
          providerFacility: [],
        }),
      ).to.deep.equal([]);
      expect(
        getPrivateEvidence({
          [HAS_PRIVATE_EVIDENCE]: false,
          providerFacility: [{}],
        }),
      ).to.deep.equal([]);
    });
  });

  describe('getOtherEvidence', () => {
    it('should return expected value', () => {
      expect(
        getOtherEvidence({
          [HAS_OTHER_EVIDENCE]: undefined,
          additionalDocuments: [{}],
        }),
      ).to.deep.equal([]);
      expect(
        getOtherEvidence({
          [HAS_OTHER_EVIDENCE]: true,
          additionalDocuments: [{}],
        }),
      ).to.deep.equal([{}]);
      expect(
        getOtherEvidence({
          [HAS_OTHER_EVIDENCE]: true,
          additionalDocuments: [],
        }),
      ).to.deep.equal([]);
      expect(
        getOtherEvidence({
          [HAS_OTHER_EVIDENCE]: false,
          additionalDocuments: [{}],
        }),
      ).to.deep.equal([]);
    });
  });
});
