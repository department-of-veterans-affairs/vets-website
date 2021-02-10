// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  FETCH_FORMS,
  FETCH_FORMS_SUCCESS,
  INITIAL_SORT_STATE,
} from '../../constants';
import findVAFormsReducer from '../../reducers/findVAFormsReducer';

describe('Find VA Forms reducer: findVAFormsReducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = findVAFormsReducer(undefined, emptyAction);

    expect(result).to.be.deep.equal({
      error: '',
      fetching: false,
      page: 1,
      query: '',
      results: null,
      sortByPropertyName: INITIAL_SORT_STATE,
      hasOnlyRetiredForms: false,
      startIndex: 0,
    });
  });

  it('fetches forms', () => {
    const action = { type: FETCH_FORMS, query: 'testing' };
    const state = findVAFormsReducer(undefined, action);

    expect(state).to.be.deep.equal({
      error: '',
      fetching: true,
      page: 1,
      query: 'testing',
      results: null,
      sortByPropertyName: INITIAL_SORT_STATE,
      hasOnlyRetiredForms: false,
      startIndex: 0,
    });
  });

  it('receives forms', () => {
    const initialState = {
      fetching: true,
      results: null,
    };
    const action = {
      type: FETCH_FORMS_SUCCESS,
      results: [],
      hasOnlyRetiredForms: false,
    };
    const state = findVAFormsReducer(initialState, action);

    expect(state.fetching).to.be.false;
    expect(state.results).to.be.instanceOf(Array);
  });
});
