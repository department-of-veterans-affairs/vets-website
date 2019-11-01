/* eslint-disable no-case-declarations */
import {
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_SUCCEEDED,
} from '../actions';
import { normalizedInstitutionAttributes } from './utility';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';
import _ from 'lodash';

const INITIAL_STATE = {
  attributes: {},
  version: {},
  inProgress: false,
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
      };
    case FETCH_PROFILE_SUCCEEDED:
      const camelPayload = camelCaseKeysRecursive(action.payload);
      const bahGrandfathered = _.get(
        action,
        'zipRatesPayload.data.attributes.mhaRateGrandfathered',
      );
      const attributes = {
        ...normalizedInstitutionAttributes({
          ...camelPayload.data.attributes,
          ...camelPayload.data.links,
        }),
        bahGrandfathered,
      };

      // delete attributes.self;
      const version = camelPayload.meta.version;
      return {
        ...state,
        attributes,
        version,
        inProgress: false,
      };
    default:
      return state;
  }
}
