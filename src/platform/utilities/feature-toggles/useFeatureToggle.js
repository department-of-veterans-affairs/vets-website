import { useSelector } from 'react-redux';
import TOGGLE_NAMES from './featureFlagNames';

export const toggleValuesSelector = state => state.featureToggles || {};

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
