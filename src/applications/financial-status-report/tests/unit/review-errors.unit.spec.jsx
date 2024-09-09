import { expect } from 'chai';
import reviewErrors from '../../utils/reviewErrors';

describe('ReviewErrors', () => {
  describe('_override function', () => {
    it('should have an _override function', () => {
      expect(reviewErrors._override).to.be.a('function');
    });

    it('should return correct mapping for questions', () => {
      const result = reviewErrors._override('questions.hasVehicle');
      expect(result).to.deep.equal({
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedVehicleRecords',
      });
    });

    it('should return correct mapping for selectedDebtsAndCopays', () => {
      const result = reviewErrors._override('selectedDebtsAndCopays');
      expect(result).to.deep.equal({
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionOption',
      });
    });

    it('should return null for unknown error', () => {
      const result = reviewErrors._override('unknown.error');
      expect(result).to.be.null;
    });

    it('should handle resolution amount errors', () => {
      const fullError = { __errors: ['Invalid resolution amount'] };
      const result = reviewErrors._override(
        'selectedDebtsAndCopays',
        fullError,
      );
      expect(result).to.deep.equal({
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionComment',
      });
    });

    it('should return correct mapping for spouse information', () => {
      const result = reviewErrors._override('questions.isMarried');
      expect(result).to.deep.equal({
        chapterKey: 'veteranInformationChapter',
        pageKey: 'spouseInformation',
      });
    });
  });
});
