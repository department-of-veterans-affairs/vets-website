import { expect } from 'chai';
import { getQuestionRouteName, getResultsRouteName } from '../../constants';

describe('constants utilities', () => {
  describe('getQuestionRouteName: ', () => {
    it('should properly format a route with only a short name', () => {
      expect(getQuestionRouteName('Q_1_1_CLAIM_DECISION')).to.equal(
        'decision-status',
      );
    });

    it('should properly format a route with a short name and an index', () => {
      expect(getQuestionRouteName('Q_1_1_CLAIM_DECISION', 'a')).to.equal(
        'decision-status-a',
      );
    });

    it('should return an empty string when it cannot find the H1', () => {
      expect(getQuestionRouteName('SOME_QUESTION')).to.equal('');
    });
  });

  describe('getResultsRouteName: ', () => {
    it('should return converted route for NON_DR result type', () => {
      expect(getResultsRouteName('NON_DR')).to.equal('your-available-options');
    });

    it('should return converted route for DR result type', () => {
      expect(getResultsRouteName('DR')).to.equal(
        'your-decision-review-options',
      );
    });
  });
});
