import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'claim_letters_access'
export const showClaimLettersFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.claimLettersAccess];

// 'cst_use_lighthouse'
// endpoint - one of '5103', 'index', 'show'
export const cstUseLighthouse = (state, endpoint) => {
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

  // Returning true here because the feature toggle sometimes returns
  // undefined and the feature toggle should always return true anyways
  if (endpoint === 'show') return true;

  return toggleValues(state)[
    FEATURE_FLAG_NAMES[`cstUseLighthouse#${endpoint}`]
  ];
};

// 'cst_include_ddl_boa_letters'
export const cstIncludeDdlBoaLetters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdlBoaLetters];

// 'cst_include_ddl_5103_letters'
export const cstIncludeDdl5103Letters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdl5103Letters];

// 'benefits_documents_use_lighthouse'
export const benefitsDocumentsUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.benefitsDocumentsUseLighthouse];

// 'cst_use_claim_details_v2'
export const cstUseClaimDetailsV2 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstUseClaimDetailsV2];

// Backend Services
export const getBackendServices = state => state.user.profile.services;
