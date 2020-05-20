import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const selectProfileUi = state => state.profileUi || {};

export const selectIsSideNavOpen = state =>
  selectProfileUi(state).isSideNavOpen;
export const selectIsMenuTriggerPinned = state =>
  selectProfileUi(state).isMenuTriggerPinned;
export const selectFocusTriggerButton = state =>
  selectProfileUi(state).focusTriggerButton;

export const selectShowProfile2 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.profileShowProfile2];
