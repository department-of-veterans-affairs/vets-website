import { useSelector } from 'react-redux';
import TOGGLE_NAMES from './featureFlagNames';

export const toggleValuesSelector = state => state.featureToggles || {};

export const loadingTogglesSelector = state => state?.featureToggles?.loading;

export const useFeatureToggle = () => {
  const useToggleValue = toggleName => {
    if (!Object.values(TOGGLE_NAMES).includes(toggleName)) {
      throw new Error(
        `Invalid toggle name "${toggleName}". Did you add the toggle name to featureFlagNames.js?`,
      );
    }
    return useSelector(state => toggleValuesSelector(state)?.[toggleName]);
  };

  const useToggleLoadingValue = () => {
    return useSelector(state => loadingTogglesSelector(state));
  };

  return {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  };
};
