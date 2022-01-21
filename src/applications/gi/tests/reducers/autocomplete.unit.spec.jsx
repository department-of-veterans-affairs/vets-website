import { expect } from 'chai';

import autocompleteReducer from '../../reducers/autocomplete';

const initialState = {
  inProgress: false,
  previewVersion: null,
  searchTerm: '',
  facilityCode: null,
  suggestions: [],
};

describe('autocomplete reducer', () => {
  it('should start autocomplete correctly', () => {
    const state = autocompleteReducer(initialState, {
      type: 'AUTOCOMPLETE_STARTED',
    });

    expect(state.inProgress).to.eql(true);
    expect(state.suggestions).to.eql([]);
  });

  it('should handle autocomplete failure', () => {
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

    expect(state.inProgress).to.eql(false);
    expect(state.searchTerm).to.eql('searchTerm');
    expect(state.errorMessage).to.eql('error');
  });
});
