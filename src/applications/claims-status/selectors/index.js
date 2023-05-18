import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import environment from 'platform/utilities/environment';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'claim_letters_access'
export const showClaimLettersFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.claimLettersAccess];

// 'cst_use_lighthouse'
export const cstUseLighthouse = (state, params = {}) => {
  if (!environment.isProduction() && params.useLighthouse) {
    return params.useLighthouse === 'true';
  }

  return toggleValues(state)[FEATURE_FLAG_NAMES.cstUseLighthouse];
};
// 'cst_include_ddl_boa_letters'
export const cstIncludeDdlBoaLetters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdlBoaLetters];

// Backend Services
export const getBackendServices = state => state.user.profile.services;
