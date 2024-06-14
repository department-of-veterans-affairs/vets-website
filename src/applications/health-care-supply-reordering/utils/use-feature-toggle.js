import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectFeatureToggles } from './selectors/feature-toggles';

const useFeatureToggle = () => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const {
    isSupplyReorderingSleepApneaEnabled,
    isLoadingFeatureFlags,
  } = featureToggles;
  return { isSupplyReorderingSleepApneaEnabled, isLoadingFeatureFlags };
};

export { useFeatureToggle };
