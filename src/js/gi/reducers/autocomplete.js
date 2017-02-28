/* eslint-disable no-case-declarations */
import { AUTOCOMPLETE_TERM_CHANGED, AUTOCOMPLETE_STARTED, AUTOCOMPLETE_FAILED, AUTOCOMPLETE_SUCCEEDED } from '../actions';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

const INITIAL_STATE = {
  inProgress: false,
  previewVersion: null,
  searchTerm: '',
  facilityCode: null,
  suggestions: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTOCOMPLETE_TERM_CHANGED:
      return {
        ...state,
        searchTerm: action.searchTerm,
        facilityCode: null
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
        searchTerm: action.value,
        inProgress: false
      };
    case AUTOCOMPLETE_SUCCEEDED:
      const camelPayload = camelCaseKeysRecursive(action.payload);
      return {
        ...state,
        suggestions: camelPayload.data,
        previewVersion: camelPayload.meta.version,
        inProgress: false
      };
    default:
      return state;
  }
}
