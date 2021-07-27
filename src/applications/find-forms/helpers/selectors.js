// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const getFindFormsAppState = state => state.findVAFormsReducer;
export const applyPDFInfoBoxOne = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagOne];
export const applyPDFInfoBoxTwo = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagTwo];
export const applyPDFInfoHelpText = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.findFormsEnhancementFlagThree];
