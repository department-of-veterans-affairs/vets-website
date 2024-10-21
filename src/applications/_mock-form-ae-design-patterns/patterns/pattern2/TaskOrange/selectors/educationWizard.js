// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const showEduBenefits1990EWizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990EWizard];

export const showEduBenefits1995Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1995Wizard];

export const showEduBenefits1990Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990Wizard];

export const showEduBenefits0994Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits0994Wizard];

export const showEduBenefits5490Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits5490Wizard];

export const showEduBenefits1990NWizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990NWizard];

export const showEduBenefits5495Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits5495Wizard];

export const showMebDgi40Feature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showMebDgi40Features];

export const merge1995And5490Feature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.merge1995And5490];
