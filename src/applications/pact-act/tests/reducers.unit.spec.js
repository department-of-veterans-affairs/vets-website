import { expect } from 'chai';
import { createFormStore } from '../reducers';

describe('reducer', () => {
  describe('utilities: createFormStore', () => {
    const SHORT_NAME_MAP = {
      SERVICE_PERIOD: 'SERVICE_PERIOD',
      BURN_PIT_2_1: 'BURN_PIT_2_1',
    };

    it('should correctly populate the store with all of the question short names', () => {
      expect(createFormStore(SHORT_NAME_MAP)).to.deep.equal({
        SERVICE_PERIOD: null,
        BURN_PIT_2_1: null,
      });
    });
  });
});
