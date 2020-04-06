import autocompleteReducer from '../../reducers/autocomplete';

const initialState = {
  inProgress: false,
  previewVersion: null,
  searchTerm: '',
  facilityCode: null,
  suggestions: [],
};

describe('autocomplete reducer', () => {
  test('should change autocomplete term', () => {
    const state = autocompleteReducer(
      { ...initialState, facilityCode: 'code' },
      {
        type: 'AUTOCOMPLETE_TERM_CHANGED',
        searchTerm: 'newSearchTerm',
      },
    );

    expect(state.facilityCode).toBe(null);
    expect(state.searchTerm).toBe('newSearchTerm');
  });

  test('should start autocomplete correctly', () => {
    const state = autocompleteReducer(initialState, {
      type: 'AUTOCOMPLETE_STARTED',
    });

    expect(state.inProgress).toBe(true);
    expect(state.suggestions).toEqual([]);
  });

  test('should handle autocomplete failure', () => {
    const state = autocompleteReducer(
      { inProgress: true },
      {
        type: 'AUTOCOMPLETE_FAILED',
        err: {
          errorMessage: 'error',
        },
        value: 'searchTerm',
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.searchTerm).toBe('searchTerm');
    expect(state.errorMessage).toBe('error');
  });

  test('should handle autocomplete success', () => {
    const state = autocompleteReducer(
      { ...initialState, searchTerm: 'searchTerm', inProgress: true },
      {
        type: 'AUTOCOMPLETE_SUCCEEDED',
        payload: {
          data: [
            {
              id: 1,
              value: 'autocomplete label',
              label: 'autocomplete label',
            },
          ],
          meta: {
            version: 1,
          },
        },
      },
    );

    expect(state.suggestions.length).toBe(2);
    expect(state.suggestions[0]).toEqual({
      id: null,
      value: 'searchTerm',
      label: 'searchTerm',
    });
    expect(state.suggestions[1]).toEqual({
      id: 1,
      value: 'autocomplete label',
      label: 'autocomplete label',
    });
    expect(state.previewVersion).toBe(1);
    expect(state.inProgress).toBe(false);
  });

  test('should handle autocomplete clear', () => {
    const state = autocompleteReducer(
      {
        ...initialState,
        suggestions: [{}],
      },
      {
        type: 'AUTOCOMPLETE_CLEARED',
        query: {
          name: 'newSearchTerm',
        },
      },
    );

    expect(state.suggestions.length).toBe(0);
  });

  test('should handle search starting', () => {
    const state = autocompleteReducer(initialState, {
      type: 'SEARCH_STARTED',
      query: {
        name: 'newSearchTerm',
      },
    });

    expect(state.searchTerm).toBe('newSearchTerm');
  });
});
