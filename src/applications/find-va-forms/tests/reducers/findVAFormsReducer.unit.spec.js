// Dependencies.
import { expect } from 'chai';
// Relative imports.
import { FETCH_FORMS, FETCH_FORMS_SUCCESS } from '../../constants';
import findVAFormsReducer from '../../reducers/findVAFormsReducer';

describe('Find VA Forms reducer: findVAFormsReducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = findVAFormsReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      fetching: false,
      query: '',
      results: null,
    });
  });

  it('fetches forms', () => {
    const action = { type: FETCH_FORMS, query: 'testing' };
    const state = findVAFormsReducer(undefined, action);

    expect(state).to.be.deep.equal({
      fetching: true,
      query: 'testing',
      results: null,
    });
  });

  it('receives forms', () => {
    const initialState = {
      fetching: true,
      results: null,
    };
    const action = { type: FETCH_FORMS_SUCCESS, results: [] };
    const state = findVAFormsReducer(initialState, action);

    expect(state.fetching).to.be.false;
    expect(state.results).to.be.instanceOf(Array);
  });
});
