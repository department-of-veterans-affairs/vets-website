import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectMerge1995And5490 = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.merge1995And5490];

export const selectShowEduBenefits1995Wizard = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.showEduBenefits1995Wizard];

export const selectMeb1995Reroute = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.meb1995Reroute];
