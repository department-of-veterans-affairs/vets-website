import { expect } from 'chai';
import reviewErrors from '../reviewErrors';

describe('reviewErrors', () => {
  describe('condition', () => {
    it('returns condition text', () => {
      expect(reviewErrors.condition(2)).to.equal(
        'New conditions (in the third section, enter a condition or select one from the list)',
      );
    });
  });

  describe('newDisabilities', () => {
    it('returns error message string', () => {
      expect(reviewErrors.newDisabilities).to.equal(
        'Reason for claim (select at least one type and add at least one new condition)',
      );
    });
  });

  describe('_override for newDisabilities errors', () => {
    it('redirects empty array error to claim-type page', () => {
      const result = reviewErrors._override('newDisabilities');
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
      });
    });

    it('redirects instance.newDisabilities error to claim-type page', () => {
      const result = reviewErrors._override('instance.newDisabilities');
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
      });
    });

    it('redirects minItems error to claim-type page', () => {
      const result = reviewErrors._override(
        'instance.newDisabilities does not meet minimum length of 1',
      );
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
      });
    });

    it('redirects condition error within newDisabilities array to claim-type page', () => {
      const result = reviewErrors._override('newDisabilities[0]');
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
      });
    });

    it('redirects condition error with stack message to claim-type page', () => {
      const result = reviewErrors._override(
        'instance.newDisabilities[0] requires property "condition"',
      );
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
      });
    });

    it('redirects condition error with both newDisabilities and condition to claim-type page', () => {
      const result = reviewErrors._override(
        'newDisabilities[1] condition is required',
      );
      expect(result).to.deep.equal({
        chapterKey: 'disabilities',
        pageKey: 'claimType',
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
