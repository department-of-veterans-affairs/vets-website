import { expect } from 'chai';
import { reduceActions } from '../unitHelpers';

describe('personalization common unitHelpers', () => {
  describe('reduceActions', () => {
    it('supports reducer-first invocation', () => {
      const reducer = (state = 0, action) => {
        switch (action.type) {
          case 'INC':
            return state + 1;
          case 'ADD':
            return state + action.amount;
          default:
            return state;
        }
      };

      const actions = [{ type: 'INC' }, { type: 'ADD', amount: 2 }];
      const results = reduceActions(reducer)(actions);

      expect(results).to.deep.equal([0, 1, 3]);
    });
  });
});
