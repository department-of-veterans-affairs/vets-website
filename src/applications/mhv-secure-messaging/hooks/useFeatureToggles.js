import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const {
    featureTogglesLoading,
    isSignatureSettingsEnabled,
    isComboBoxEnabled,
  } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        isSignatureSettingsEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingSignatureSettings
          ],
        isComboBoxEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox
          ],
      };
    },
    state => state.featureToggles,
  );

  return {
    featureTogglesLoading,
    isSignatureSettingsEnabled,
    isComboBoxEnabled,
  };
};

export default useFeatureToggles;
