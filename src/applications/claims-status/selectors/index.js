import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'claim_letters_access'
export const showClaimLettersFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.claimLettersAccess];

// 'cst_use_lighthouse'
export const cstUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstUseLighthouse];

// Backend Services
export const getBackendServices = state => state.user.profile.services;
