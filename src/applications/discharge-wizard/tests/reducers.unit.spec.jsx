import { expect } from 'chai';
import { createFormStore } from '../reducers/utilities';

describe('reducer', () => {
  describe('utilities: createFormStore', () => {
    const SHORT_NAME_MAP = {
      SERVICE_BRANCH: 'SERVICE_BRANCH',
      DISCHARGE_YEAR: 'DISCHARGE_YEAR',
      DISCHARGE_MONTH: 'DISCHARGE_MONTH',
    };

    it('should correctly populate the store with all of the question short names', () => {
      expect(createFormStore(SHORT_NAME_MAP)).to.deep.equal({
        SERVICE_BRANCH: null,
        DISCHARGE_YEAR: null,
        DISCHARGE_MONTH: null,
      });
    });
  });
});
