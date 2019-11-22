import { expect } from 'chai';

import * as ACTIONS from '../../actions';

describe('Find VA Forms actions', () => {
  describe('updateQuery', () => {
    const { QUERY_CHANGED, updateQuery } = ACTIONS;

    it('should update the query with passed value', () => {
      const inputValue = 'some text';
      const result = updateQuery(inputValue);

      expect(result).to.be.deep.equal({
        type: QUERY_CHANGED,
        query: inputValue,
      });
    });
  });
});
