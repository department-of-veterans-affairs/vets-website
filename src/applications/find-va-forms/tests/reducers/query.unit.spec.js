import { expect } from 'chai';

import * as ACTIONS from '../../actions';
import queryReducer from '../../reducers/query';

describe('Find VA Forms reducer: query', () => {
  it('returns the default state', () => {
    const result = queryReducer(undefined, {});
    expect(result).to.be.equal('');
  });

  it('sets the query property', () => {
    const query = 'some text';
    const result = queryReducer(undefined, {
      type: ACTIONS.QUERY_CHANGED,
      query,
    });

    expect(result).to.be.equal(query);
  });
});
