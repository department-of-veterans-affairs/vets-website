// Dependencies.
import { FETCH_FORMS, FETCH_FORMS_SUCCESS } from '../../constants';
import findVAFormsReducer from '../../reducers/findVAFormsReducer';

describe('Find VA Forms reducer: findVAFormsReducer', () => {
  it('returns the default state', () => {
    const emptyAction = {};
    const result = findVAFormsReducer(undefined, emptyAction);

    expect(result).toEqual({
      error: '',
      fetching: false,
      page: 1,
      query: '',
      results: null,
      startIndex: 0,
    });
  });

  it('fetches forms', () => {
    const action = { type: FETCH_FORMS, query: 'testing' };
    const state = findVAFormsReducer(undefined, action);

    expect(state).toEqual({
      error: '',
      fetching: true,
      page: 1,
      query: 'testing',
      results: null,
      startIndex: 0,
    });
  });

  it('receives forms', () => {
    const initialState = {
      fetching: true,
      results: null,
    };
    const action = { type: FETCH_FORMS_SUCCESS, results: [] };
    const state = findVAFormsReducer(initialState, action);

    expect(state.fetching).toBe(false);
    expect(state.results).toBeInstanceOf(Array);
  });
});
