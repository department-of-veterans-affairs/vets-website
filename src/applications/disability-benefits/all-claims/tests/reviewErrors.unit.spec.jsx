import { expect } from 'chai';
import reviewErrors from '../reviewErrors';

describe('reviewErrors', () => {
  const EXPECTED_MESSAGE =
    'Reason for claim (select at least one type and add at least one new condition)';
  const EXPECTED_CLAIM_TYPE_REDIRECT = {
    chapterKey: 'disabilities',
    pageKey: 'claimType',
    navigationType: 'redirect',
  };

  describe('newDisabilities', () => {
    it('returns error message string', () => {
      expect(reviewErrors.newDisabilities).to.equal(EXPECTED_MESSAGE);
    });
  });

  describe('condition', () => {
    it('returns same message as newDisabilities regardless of index', () => {
      expect(reviewErrors.condition()).to.equal(EXPECTED_MESSAGE);
      expect(reviewErrors.condition(0)).to.equal(EXPECTED_MESSAGE);
      expect(reviewErrors.condition(2)).to.equal(EXPECTED_MESSAGE);
    });
  });

  describe('_override for newDisabilities and condition errors', () => {
    const errorCases = [
      'newDisabilities',
      'instance.newDisabilities',
      'instance.newDisabilities does not meet minimum length of 1',
      'newDisabilities[0]',
      'instance.newDisabilities[0] requires property "condition"',
      'newDisabilities[1] condition is required',
      'condition',
      'instance.newDisabilities[0].condition',
      'newDisabilities[0].condition',
    ];

    errorCases.forEach(errorString => {
      it(`redirects "${errorString}" error to claim-type page`, () => {
        const result = reviewErrors._override(errorString);
        expect(result).to.deep.equal(EXPECTED_CLAIM_TYPE_REDIRECT);
      });
    });
  });

  describe('toxicExposure', () => {
    it('builds error for gulf war 1990 details page', () => {
      const res = reviewErrors._override(
        'toxicExposure.gulfWar1990Details.afghanistan.startDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('gulf-war-1990-location-afghanistan');
    });

    it('builds error for gulf war 2001 details page', () => {
      const res = reviewErrors._override(
        'toxicExposure.gulfWar2001Details.lebanon.endDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('gulf-war-2001-location-lebanon');
    });

    it('builds error for herbicide details page', () => {
      const res = reviewErrors._override(
        'toxicExposure.herbicideDetails.cambodia.startDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('herbicide-location-cambodia');
    });

    it('builds error for other exposure details', () => {
      const res = reviewErrors._override(
        'toxicExposure.otherExposuresDetails.mos.startDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('additional-exposure-mos');
    });

    it('builds error for other herbicide locations', () => {
      const res = reviewErrors._override(
        'toxicExposure.otherHerbicideLocations.startDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('herbicide-location-other');
    });

    it('builds error for other exposures details page', () => {
      const res = reviewErrors._override(
        'toxicExposure.specifyOtherExposures.endDate',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('additional-exposure-other');
    });

    it('builds error for herbicide locations page', () => {
      const res = reviewErrors._override(
        'toxicExposure.otherHerbicideLocations.description',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('herbicideLocations');
    });

    it('builds error for additional exposures page', () => {
      const res = reviewErrors._override(
        'toxicExposure.specifyOtherExposures.description',
      );

      expect(typeof res).to.equal('object');
      expect(res.chapterKey).to.equal('disabilities');
      expect(res.pageKey).to.equal('additional-exposures');
    });
  });

  describe('default', () => {
    it('handles key not found', () => {
      expect(reviewErrors._override('foo.bar.foo')).to.equal(null);
    });
  });
});
