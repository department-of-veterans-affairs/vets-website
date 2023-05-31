import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'claim_letters_access'
export const showClaimLettersFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.claimLettersAccess];

// 'cst_use_lighthouse'
export const cstUseLighthouse = state => {
  const flipperOverrideMode = sessionStorage.getItem('cstFlipperOverrideMode');
  if (flipperOverrideMode) {
    switch (flipperOverrideMode) {
      case 'featureToggle':
        break;
      case 'evss':
        return false;
      case 'lighthouse':
        return true;
      default:
        break;
    }
  }
  return toggleValues(state)[FEATURE_FLAG_NAMES.cstUseLighthouse];
};

// 'cst_include_ddl_boa_letters'
export const cstIncludeDdlBoaLetters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdlBoaLetters];

// Backend Services
export const getBackendServices = state => state.user.profile.services;
