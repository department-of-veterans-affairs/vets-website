import { expect } from 'chai';
import { getRouteName } from '../../constants';

describe('constants utilities', () => {
  describe('getRouteName: ', () => {
    it('should properly format a route with only a short name', () => {
      expect(getRouteName('Q_1_1_CLAIM_DECISION')).to.equal('decision-status');
    });

    it('should properly format a route with a short name and an index', () => {
      expect(getRouteName('Q_1_1_CLAIM_DECISION', 'a')).to.equal(
        'decision-status-a',
      );
    });

    it('should return an empty string when it cannot find the H1', () => {
      expect(getRouteName('SOME_QUESTION')).to.equal('');
    });
  });
});
