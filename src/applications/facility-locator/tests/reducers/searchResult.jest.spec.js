import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  SEARCH_FAILED,
} from '../../utils/actionTypes';
import {
  SearchResultReducer as reducer,
  INITIAL_STATE,
} from '../../reducers/searchResult';

describe('Reducer Tests :: SearchResultReducer', () => {
  test('Fluff Test To Prove Jest Is Wired In Correctly', () => {
    expect(true).toEqual(true);
  });

  test('Initial state should be returned for non-actions', () => {
    const nonAction = { type: 'UNKNOWN' };
    const resultState = reducer(undefined, nonAction);

    expect(resultState).toEqual(INITIAL_STATE);
  });

  test('FETCH_LOCATION_DETAIL Updates Selected Result', () => {
    const payload = {
      data: {
        id: 'vha_691GE',
        type: 'va_facilities',
        attributes: { uniqueId: '343o' },
      },
    };
    const action = { type: FETCH_LOCATION_DETAIL, payload };
    const expectedState = {
      ...INITIAL_STATE,
      selectedResult: payload,
    };
    const resultState = reducer(undefined, action);

    expect(resultState.selectedResult).not.toBeNull();
    expect(resultState).toEqual(expectedState);
  });

  test('FETCH_LOCATIONS correctly updates state', () => {
    const payload = {
      data: [
        {
          id: 'vha_691GE',
          type: 'va_facilities',
          attributes: { uniqueId: '343o' },
        },
      ],
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 20,
          totalPages: 1,
          totalEntries: 3,
        },
      },
    };
    const action = { type: FETCH_LOCATIONS, payload };
    const expectedState = {
      results: [...payload.data],
      selectedResult: INITIAL_STATE.selectedResult,
      pagination: { ...payload.meta.pagination },
    };
    const resultState = reducer(undefined, action);

    expect(resultState.results.length).toEqual(1);
    expect(resultState).toEqual(expectedState);
  });

  test('SEARCH_FAILED Resets Store To Defaults', () => {
    const payload = {};
    const storeState = {
      data: [
        {
          id: 'vha_691GE',
          type: 'va_facilities',
          attributes: { uniqueId: '343o' },
        },
      ],
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 20,
          totalPages: 1,
          totalEntries: 3,
        },
      },
    };
    const action = { type: SEARCH_FAILED, payload };
    const expectedState = { ...INITIAL_STATE };
    const resultState = reducer(storeState, action);

    expect(resultState).toEqual(expectedState);
  });
});
