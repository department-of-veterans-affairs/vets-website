// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const educationWizard10203 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.eduBenefitsStemScholarship];

export const showEduBenefits1990EWizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990EWizard];

export const showEduBenefits1995Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1995Wizard];

export const showEduBenefits0994Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits0994Wizard];

export const showEduBenefits5490Wizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits5490Wizard];

export const showEduBenefits1990NWizard = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990NWizard];
