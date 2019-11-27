// Dependencies.
import { expect } from 'chai';
// Relative imports.
import findVAFormsReducer from '../../reducers/findVAFormsReducer';

describe('Find VA Forms reducer: index', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = findVAFormsReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      fetching: false,
      query: '',
      results: [],
    });
  });
});
