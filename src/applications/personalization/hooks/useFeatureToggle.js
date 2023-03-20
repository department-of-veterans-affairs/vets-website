import { useSelector } from 'react-redux';
import { toggleValues as toggleValuesSelector } from '~/platform/site-wide/feature-toggles/selectors';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

export const useFeatureToggle = () => {
  const useToggleValue = toggleName => {
    if (!Object.values(TOGGLE_NAMES).includes(toggleName)) {
      throw new Error(
        `Invalid toggle name "${toggleName}". Did you add the toggle name to featureFlagNames.js?`,
      );
    }
    return useSelector(state => toggleValuesSelector(state)?.[toggleName]);
  };
  return {
    TOGGLE_NAMES,
    useToggleValue,
  };
};
