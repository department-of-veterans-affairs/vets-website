import {
  AUTOCOMPLETE_TERM_CHANGED,
  AUTOCOMPLETE_STARTED,
  AUTOCOMPLETE_FAILED,
  AUTOCOMPLETE_SUCCEEDED,
  AUTOCOMPLETE_CLEARED,
} from '../actions';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

const INITIAL_STATE = {
  inProgress: false,
  previewVersion: null,
  searchTerm: '',
  facilityCode: null,
  suggestions: [],
};

const camelCasedFields = (searchTerm, payload) => {
  const camelCasedPayload = camelCaseKeysRecursive(payload);
  const previewVersion = camelCasedPayload.meta.version;
  const suggestions = camelCasedPayload.data;
  const shouldIncludeSearchTerm =
    searchTerm && suggestions.length && searchTerm !== suggestions[0].label;
  if (shouldIncludeSearchTerm) {
    suggestions.unshift({
      id: null,
      value: searchTerm,
      label: searchTerm,
    });
  }

  return {
    suggestions,
    previewVersion,
  };
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTOCOMPLETE_TERM_CHANGED:
      return {
        ...state,
        searchTerm: action.searchTerm,
        facilityCode: null,
      };
    case AUTOCOMPLETE_STARTED:
      return {
        ...state,
        inProgress: true,
        suggestions: [],
      };
    case AUTOCOMPLETE_FAILED:
      return {
        ...state,
        ...action.err,
        searchTerm: action.value,
        inProgress: false,
      };
    case AUTOCOMPLETE_SUCCEEDED:
      return {
        ...state,
        ...camelCasedFields(state.searchTerm, action.payload),
        inProgress: false,
      };
    case AUTOCOMPLETE_CLEARED:
      return {
        ...state,
        suggestions: [],
      };
    default:
      return state;
  }
}
