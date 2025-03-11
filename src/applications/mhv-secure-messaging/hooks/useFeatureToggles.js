import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const { featureTogglesLoading, isSignatureSettingsEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        isSignatureSettingsEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingSignatureSettings
          ],
      };
    },
    state => state.featureToggles,
  );

  return { featureTogglesLoading, isSignatureSettingsEnabled };
};

export default useFeatureToggles;
