import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'claim_letters_access'
export const showClaimLettersFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.claimLettersAccess];

// 'cst_include_ddl_boa_letters'
export const cstIncludeDdlBoaLetters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdlBoaLetters];

// 'cst_include_ddl_5103_letters'
export const cstIncludeDdl5103Letters = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstIncludeDdl5103Letters];

// 'benefits_documents_use_lighthouse'
export const benefitsDocumentsUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.benefitsDocumentsUseLighthouse];

// 'cst_use_dd_rum'
export const cstUseDataDogRUM = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.cstUseDataDogRUM];

// Backend Services
export const getBackendServices = state => state.user.profile.services;
