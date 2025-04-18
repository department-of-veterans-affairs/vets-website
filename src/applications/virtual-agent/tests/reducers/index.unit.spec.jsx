import { expect } from 'chai';

import reducers, { ACCEPTED } from '../../reducers';

describe('index', () => {
  const state = { termsAccepted: false };

  describe('reducer', () => {
    it('should return default state when state is not passed in', () => {
      const result = reducers.virtualAgentData(undefined, { type: ACCEPTED });

      expect(result).to.deep.equal({ termsAccepted: true });
    });
    it('should return termsAccepted as true when action type is ACCEPTED', () => {
      const result = reducers.virtualAgentData(state, {
        type: ACCEPTED,
      });

      expect(result).to.deep.equal({ termsAccepted: true });
    });
    it('should return the state when the action type is not ACCEPTED', () => {
      const result = reducers.virtualAgentData(state, { type: 'OTHER' });

      expect(result).to.deep.equal({ termsAccepted: false });
    });
  });
});
