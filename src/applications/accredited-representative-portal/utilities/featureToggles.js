import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export const IsCustomLoginEnabled = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  return useToggleValue(TOGGLE_NAMES.accreditedRepresentativePortalCustomLogin);
};
