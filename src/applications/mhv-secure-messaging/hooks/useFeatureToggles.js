import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

const useFeatureToggles = () => {
  const {
    featureTogglesLoading,
    isComboBoxEnabled,
    isAalEnabled,
    readReceiptsEnabled,
  } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        isComboBoxEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientCombobox
          ],
        isAalEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingMilestone2AAL
          ],
        readReceiptsEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingReadReceipts
          ],
      };
    },
    state => state.featureToggles,
  );

  return {
    featureTogglesLoading,
    isComboBoxEnabled,
    readReceiptsEnabled,
    isAalEnabled,
  };
};

export default useFeatureToggles;
