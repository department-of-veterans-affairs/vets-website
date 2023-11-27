import { expect } from 'chai';

import autocompleteReducer, {
  buildSuggestions,
} from '../../reducers/autocomplete';

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
    const action = {
      type: 'AUTOCOMPLETE_FAILED',
      err: {
        errorMessage: 'error',
      },
      value: 'searchTerm',
      inProgress: false,
    };

    const newState = autocompleteReducer(initialState, action);

    expect(newState.inProgress).to.eql(false);
    expect(newState.searchTerm).to.eql('searchTerm');
    expect(newState.errorMessage).to.eql('error');
  });

  it('should handle NAME_AUTOCOMPLETE_SUCCEEDED', () => {
    const action = {
      type: 'NAME_AUTOCOMPLETE_SUCCEEDED',
      payload: [{ label: 'John Doe' }, { label: 'Johnny' }],
    };

    const newState = autocompleteReducer(initialState, action);
    expect(newState.inProgress).to.equal(false);
    expect(newState.name).to.equal(initialState.name);
    // You can also check if the nameSuggestions state has been updated as expected
    expect(newState.nameSuggestions).to.eql([
      { label: 'John Doe' },
      { label: 'Johnny' },
    ]);
  });

  it('should handle LOCATION_AUTOCOMPLETE_SUCCEEDED', () => {
    const action = {
      type: 'LOCATION_AUTOCOMPLETE_SUCCEEDED',
      payload: [
        { placeName: 'New York', center: [40.7128, -74.006] },
        { placeName: 'Los Angeles', center: [34.0522, -118.2437] },
      ],
    };

    const newState = autocompleteReducer(initialState, action);
    expect(newState.inProgress).to.equal(false);
    expect(newState.location).to.equal(initialState.location);
    expect(newState.locationSuggestions).to.eql([
      { label: 'New York', coords: [40.7128, -74.006] },
      { label: 'Los Angeles', coords: [34.0522, -118.2437] },
    ]);
  });

  it('should handle UPDATE_AUTOCOMPLETE_LOCATION', () => {
    const action = {
      type: 'UPDATE_AUTOCOMPLETE_LOCATION',
      payload: 'Los Angeles',
    };
    const newState = autocompleteReducer(initialState, action);
    expect(newState.location).to.equal('Los Angeles');
  });

  it('should handle UPDATE_AUTOCOMPLETE_NAME', () => {
    const action = {
      type: 'UPDATE_AUTOCOMPLETE_NAME',
      payload: 'SF State',
    };
    const newState = autocompleteReducer(initialState, action);
    expect(newState.name).to.equal('SF State');
  });
  it('adds searchTerm to the beginning of the mapped suggestions if it is not the first suggestion', () => {
    const mockMapper = suggestion => ({ label: suggestion.toUpperCase() });

    const suggestions = ['one', 'two', 'three'];
    const searchTerm = 'zero';
    const mapped = buildSuggestions(suggestions, mockMapper, searchTerm);

    expect(mapped[0]).to.deep.equal({ label: searchTerm });
    expect(mapped[1]).to.deep.equal({ label: 'ONE' });
  });
});
