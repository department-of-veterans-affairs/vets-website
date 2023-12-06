import camelCaseKeysRecursive from 'camelcase-keys-recursive';
import {
  AUTOCOMPLETE_STARTED,
  AUTOCOMPLETE_FAILED,
  NAME_AUTOCOMPLETE_SUCCEEDED,
  UPDATE_AUTOCOMPLETE_NAME,
  UPDATE_AUTOCOMPLETE_LOCATION,
  LOCATION_AUTOCOMPLETE_SUCCEEDED,
} from '../actions';

const INITIAL_STATE = {
  inProgress: false,
  name: '',
  location: '',
  nameSuggestions: [],
  locationSuggestions: [],
};

export const buildSuggestions = (suggestions, mapper, searchTerm) => {
  const mapped = suggestions.map(mapper);
  if (searchTerm && suggestions.length && searchTerm !== suggestions[0].label) {
    mapped.unshift({
      label: searchTerm,
    });
  }
  return mapped;
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTOCOMPLETE_STARTED:
      return {
        ...state,
        inProgress: true,
        nameSuggestions: [],
        locationSuggestions: [],
      };
    case AUTOCOMPLETE_FAILED:
      return {
        ...state,
        ...action.err,
        searchTerm: action.value,
        inProgress: false,
      };
    case NAME_AUTOCOMPLETE_SUCCEEDED:
      return {
        ...state,
        nameSuggestions: buildSuggestions(
          camelCaseKeysRecursive(action.payload),
          item => {
            return { label: item.label };
          },
          state.name,
        ),
        inProgress: false,
      };
    case LOCATION_AUTOCOMPLETE_SUCCEEDED:
      return {
        ...state,
        locationSuggestions: buildSuggestions(
          camelCaseKeysRecursive(action.payload),
          item => {
            return { label: item.placeName, coords: item.center };
          },
          state.location,
        ),
        inProgress: false,
      };
    case UPDATE_AUTOCOMPLETE_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case UPDATE_AUTOCOMPLETE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
}
