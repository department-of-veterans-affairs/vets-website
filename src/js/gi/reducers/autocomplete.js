import { AUTOCOMPLETE_TERM_CHANGED, AUTOCOMPLETE_STARTED, AUTOCOMPLETE_FAILED, AUTOCOMPLETE_SUCCEEDED } from '../actions';

const INITIAL_STATE = {
  inProgress: false,
  previewVersion: null,
  search_term: '',
  facility_code: null,
  suggestions: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTOCOMPLETE_TERM_CHANGED:
      return {
        ...state,
        search_term: action.search_term,
        facility_code: null
      };
    case AUTOCOMPLETE_STARTED:
      return {
        ...state,
        inProgress: true
      };
    case AUTOCOMPLETE_FAILED:
      return {
        ...state,
        ...action.err,
        search_term: action.value,
        inProgress: false
      };
    case AUTOCOMPLETE_SUCCEEDED:
      return {
        ...state,
        suggestions: action.payload.data,
        previewVersion: action.payload.meta.version,
        inProgress: false
      };
    default:
      return state;
  }
}
