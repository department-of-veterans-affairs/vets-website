import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';

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

  // can remove this after verifying the toggle in staging
  if (environment.isProduction) {
    return false;
  }

  return appointV2FeaturesEnabled;
};

export default useV2FeatureToggle;
