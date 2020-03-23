/* eslint-disable no-case-declarations */
import {
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_SUCCEEDED,
} from '../actions';
import { normalizedInstitutionAttributes } from './utility';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

const INITIAL_STATE = {
  attributes: {},
  version: {},
  inProgress: false,
  error: null,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROFILE_STARTED:
      return {
        ...state,
        inProgress: true,
      };
    case FETCH_PROFILE_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false,
        error: action.payload,
      };
    case FETCH_PROFILE_SUCCEEDED:
      const camelPayload = camelCaseKeysRecursive(action.payload);
      const attributes = {
        ...normalizedInstitutionAttributes({
          ...camelPayload.data.attributes,
          ...camelPayload.data.links,
        }),
      };

      // delete attributes.self;
      const version = camelPayload.meta.version;
      return {
        ...state,
        attributes,
        version,
        inProgress: false,
        error: null,
      };
    default:
      return state;
  }
}
