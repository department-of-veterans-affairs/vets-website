import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isLoadingFeatures = state => toggleValues(state).loading;

// Feature toggles

// 'bcas_letters_use_lighthouse'
export const lettersUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.bcasLettersUseLighthouse];
