import { expect } from 'chai';

import autocompleteReducer from '../../../src/js/gi/reducers/autocomplete.js';

const initialState = {
  inProgress: false,
  previewVersion: null,
  searchTerm: '',
  facilityCode: null,
  suggestions: []
};

describe('autocomplete reducer', () => {
  it('should change autocomplete term', () => {
    const state = autocompleteReducer(
      { ...initialState, facilityCode: 'code' },
      {
        type: 'AUTOCOMPLETE_TERM_CHANGED',
        searchTerm: 'newSearchTerm',
      }
    );

    expect(state.facilityCode).to.be.eql(null);
    expect(state.searchTerm).to.be.eql('newSearchTerm');
  });

  it('should start autocomplete correctly', () => {
    const state = autocompleteReducer(
      initialState,
      {
        type: 'AUTOCOMPLETE_STARTED'
      }
    );

    expect(state.inProgress).to.be.eql(true);
    expect(state.suggestions).to.be.eql([]);
  });

  it('should handle autocomplete failure', () => {
    const state = autocompleteReducer(
      { inProgress: true },
      {
        type: 'AUTOCOMPLETE_FAILED',
        err: {
          errorMessage: 'error'
        },
        value: 'searchTerm'
      }
    );

    expect(state.inProgress).to.be.eql(false);
    expect(state.searchTerm).to.be.eql('searchTerm');
    expect(state.errorMessage).to.be.eql('error');
  });

  it('should handle autocomplete success', () => {
    const state = autocompleteReducer(
      { ...initialState, searchTerm: 'searchTerm', inProgress: true },
      {
        type: 'AUTOCOMPLETE_SUCCEEDED',
        payload: {
          data: [{
            id: 1,
            value: 'autocomplete label',
            label: 'autocomplete label'
          }],
          meta: {
            version: 1
          }
        }
      }
    );

    expect(state.suggestions.length).to.be.eql(2);
    expect(state.suggestions[0]).to.be.eql({
      id: null,
      value: 'searchTerm',
      label: 'searchTerm'
    });
    expect(state.suggestions[1]).to.be.eql({
      id: 1,
      value: 'autocomplete label',
      label: 'autocomplete label'
    });
    expect(state.previewVersion).to.be.eql(1);
    expect(state.inProgress).to.be.eql(false);
  });

  it('should handle search starting', () => {
    const state = autocompleteReducer(
      initialState,
      {
        type: 'SEARCH_STARTED',
        name: 'newSearchTerm',
      }
    );

    expect(state.searchTerm).to.be.eql('newSearchTerm');
  });
});
