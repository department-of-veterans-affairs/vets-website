import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';
import { enableV2FeaturesForLocalTesting } from '../constants/enableV2FeaturesLocally';

const useV2FeatureToggle = () => {
  const {
    TOGGLE_NAMES: { appointARepresentativeEnableV2Features: appToggleKey },
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  const appointV2FeaturesEnabled = useToggleValue(appToggleKey);
  const toggleIsLoading = useToggleLoadingValue(appToggleKey);

  if (toggleIsLoading) {
    return false;
  }

  if (window.Cypress) {
    return false;
  }

  if (environment.isLocalhost()) {
    return enableV2FeaturesForLocalTesting;
  }

  return appointV2FeaturesEnabled;
};

export default useV2FeatureToggle;
