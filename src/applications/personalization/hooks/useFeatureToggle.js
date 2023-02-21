import { useSelector } from 'react-redux';
import { toggleValues as toggleValuesSelector } from '~/platform/site-wide/feature-toggles/selectors';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

export const useFeatureToggle = () => {
  return {
    TOGGLE_NAMES,
    useToggleValue: toggleName => {
      const toggleValues = useSelector(state => toggleValuesSelector(state));
      return toggleValues?.[toggleName];
    },
  };
};
