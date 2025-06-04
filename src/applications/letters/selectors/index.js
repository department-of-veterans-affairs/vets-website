import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'bcas_letters_use_lighthouse'
export const lettersUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.bcasLettersUseLighthouse];

// 'letters_check_discrepancies'
export const lettersCheckDiscrepancies = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.lettersCheckDiscrepancies];

// 'letters_page_new_design'
export const lettersPageNewDesign = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.lettersPageNewDesign];

// Verify toggles are loaded
export const togglesAreLoaded = state => {
  return !toggleValues(state)?.loading;
};
